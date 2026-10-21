// The account form on /profile/v2: fills in the student's details, enables Save only
// when a field really changed, and saves only those fields.
import { javaURI, pythonURI, fetchOptions } from '../api/config.js';
import { getUserData } from '../aesthetihawk/profile/getUserData.js';
import { ACCOUNT_FIELDS, changedFields } from './profile-model.js';

// Flask and Spring each keep a copy of the profile, so a field is saved to both.
async function saveField(key, value) {
    const body = JSON.stringify({ [key]: value });
    const responses = await Promise.all([
        fetch(`${pythonURI}/api/user`, { ...fetchOptions, method: 'PUT', body }),
        fetch(`${javaURI}/api/person/update`, { ...fetchOptions, method: 'POST', body }),
    ]);
    const failed = responses.find(response => !response.ok);
    if (failed) throw new Error(`the server answered ${failed.status}`);
}

// Resolves with the loaded details, or null when the student isn't signed in.
export async function initAccountForm({ form, saveButton, status, onSaved }) {
    const inputFor = field => document.getElementById(field.inputId);
    const readValues = () => Object.fromEntries(ACCOUNT_FIELDS.map(field => [field.key, inputFor(field).value]));
    // The values the page loaded. Compared only after they arrive: comparing against the
    // still-empty fields made every field look edited, so Save re-sent the User ID and signed students out.
    let loaded = null;
    const pending = () => (loaded ? changedFields(loaded, readValues()) : []);

    function refresh() {
        const dirty = pending().length > 0;
        saveButton.disabled = !dirty;
        status.textContent = dirty ? 'Unsaved changes' : '';
    }

    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    window.addEventListener('beforeunload', event => {
        if (pending().length === 0) return;
        event.preventDefault();
        event.returnValue = '';
    });

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const fields = pending();
        if (fields.length === 0) return;
        const signsOut = fields.some(field => field.signsOut);
        if (signsOut && !window.confirm('Changing your User ID signs you out. You sign in again with the new ID. Save it?')) return;

        const values = readValues();
        saveButton.disabled = true;
        status.textContent = 'Saving…';
        try {
            for (const field of fields) {
                const value = values[field.key].trim();
                await saveField(field.key, value);
                loaded[field.key] = value;
            }
        } catch (error) {
            console.error('Error saving the account form:', error);
            refresh();
            status.textContent = `Couldn't save: ${error.message}. Try again.`;
            return;
        }
        status.textContent = 'Saved';
        onSaved?.({ ...loaded });
        if (signsOut) window.location.href = `${window.baseurl ?? ''}/`;
        else if (fields.some(field => field.reloadsPage)) window.location.reload();
    });

    const [name, uid, email, sid, , school] = await getUserData();
    if (!uid) {
        status.textContent = "Couldn't load your account. Are you signed in?";
        return null;
    }
    const found = { name, uid, email, sid, school };
    for (const field of ACCOUNT_FIELDS) inputFor(field).value = found[field.key] ?? '';
    // Read back from the inputs: a school that isn't in the list leaves the select empty.
    loaded = readValues();
    refresh();
    return { ...loaded };
}
