// The conversation pane. It loads the open group chat or direct message, follows its
// topic on the socket, and sends, edits and deletes through REST. For a direct message
// it also keeps read state current: opening it, or a message arriving while the tab is
// visible, marks it read and tells the navbar bell (assets/js/api/dm-notifications.js).
import { classifyDmEvent, classifyGroupEvent, dmMessage, groupMessage } from './messages-model.js';
import { createMessageLog } from './message-log.js';

export function createThread({ elements, api, socket, richText, me, onDmRead, onFileShared }) {
  // A group message's only sender field is a display name, so that is what marks yours.
  const kinds = {
    dm: {
      load: id => api.dmMessages(id).then(list => (list || []).map(dmMessage)),
      send: (id, html) => api.sendDm(id, html),
      edit: (id, messageId, html) => api.editDm(id, messageId, html),
      remove: (id, messageId) => api.deleteDm(id, messageId),
      topic: id => `/topic/dm/${id}`,
      selfKey: me.uid,
      emptyHint: 'Say hi.',
    },
    group: {
      load: id => api.groupMessages(id).then(list => (list || []).map(groupMessage)),
      send: (id, html) => api.sendGroupMessage(id, me.name, html),
      edit: (id, messageId, html) => api.editGroupMessage(id, messageId, html),
      remove: (id, messageId) => api.deleteGroupMessage(id, messageId),
      topic: id => `/topic/group/${id}`,
      selfKey: me.name,
      emptyHint: 'Say hi to your group.',
    },
  };

  let current = null; // { kind, id, loaded } for the open conversation
  let openCount = 0; // a newer open makes an older one that is still loading stop
  let editing = null; // the message being edited
  let saving = false; // a send or an edit is in flight
  let unseenWhileHidden = false;

  const log = createMessageLog(elements.messages, { richText, me, onEdit: beginEdit, onDelete: deleteMessage });
  const composer = richText.createRichComposer({ placeholder: 'Type a message…', maxLength: 2000, onSubmit: submit });
  elements.form.classList.add('chat-form--rich');
  elements.form.insertBefore(composer.element, elements.cancelEdit);

  const isOpen = (kind, id) => current?.kind === kind && current.id === id;
  const isMine = (kind, message) => message.senderKey === kinds[kind].selfKey;

  function showFormMessage(text) {
    elements.formStatus.textContent = text;
    elements.formStatus.hidden = !text;
  }

  // Icon and label go straight in the button: the preset themes recolor span text.
  function setSendLabel(icon, label) {
    const glyph = document.createElement('i');
    glyph.className = `fas ${icon}`;
    glyph.setAttribute('aria-hidden', 'true');
    elements.send.replaceChildren(glyph, ` ${label}`);
  }

  function refreshComposer() {
    const ready = Boolean(current?.loaded) && !saving;
    composer.setEnabled(ready);
    elements.send.disabled = !ready;
    elements.cancelEdit.hidden = !editing;
    elements.cancelEdit.disabled = saving;
    setSendLabel(editing ? 'fa-save' : 'fa-paper-plane', editing ? 'Save' : 'Send');
  }

  function resetEdit() {
    editing = null;
    composer.clear();
    showFormMessage('');
    refreshComposer();
  }

  function beginEdit(message) {
    if (saving || !message || message.deleted) return;
    editing = message;
    composer.setHTML(message.body);
    showFormMessage('');
    refreshComposer();
    composer.focus();
  }

  async function markRead(id) {
    onDmRead(id);
    try {
      await api.markDmRead(id);
      window.dispatchEvent(new Event('dm:refresh-unread'));
    } catch (error) {
      console.warn('Messages: could not mark the conversation read', error);
    }
  }

  // Adds anything saved that isn't on screen yet, without clearing what is.
  async function loadNew(kind, id) {
    const messages = await kinds[kind].load(id);
    if (!isOpen(kind, id)) return;
    messages.forEach(message => log.append(message, isMine(kind, message)));
  }

  async function submit() {
    if (saving || !current?.loaded || composer.isEmpty() || composer.isOverLimit()) return;
    const { kind, id } = current;
    const target = editing;
    const html = composer.getHTML();
    saving = true;
    showFormMessage('');
    refreshComposer();
    try {
      if (target) {
        await kinds[kind].edit(id, target.id, html);
        log.updateBody(target.key, html);
      } else {
        await kinds[kind].send(id, html);
        // Your message comes back on the socket. Offline, nothing comes back.
        if (!socket.isConnected()) await loadNew(kind, id);
      }
      saving = false;
      resetEdit();
    } catch (error) {
      saving = false;
      console.warn('Messages: could not save the message', error);
      if (target && log.get(target.key)?.deleted) {
        resetEdit();
        showFormMessage('That message was deleted, so your edit was not saved.');
      } else {
        refreshComposer();
        showFormMessage(target ? 'Could not save your edit. Try again.' : 'Could not send the message. Try again.');
      }
    }
  }

  async function deleteMessage(message, button) {
    if (saving || !current || !message || message.deleted) return;
    const { kind, id } = current;
    button.disabled = true;
    showFormMessage('');
    try {
      await kinds[kind].remove(id, message.id);
      log.markDeleted(message.key);
      if (editing?.key === message.key) resetEdit();
      if (kind === 'dm') {
        window.dispatchEvent(new CustomEvent('dm:message-deleted', { detail: { conversationId: id, messageId: message.id } }));
      }
    } catch (error) {
      console.warn('Messages: could not delete the message', error);
      button.disabled = false;
      showFormMessage('Could not delete the message. Try again.');
    }
  }

  function handleEvent(kind, id, event) {
    if (!isOpen(kind, id)) return;
    const change = kind === 'group' ? classifyGroupEvent(event) : classifyDmEvent(event, id, key => log.has(key));
    switch (change.type) {
      case 'message':
        log.append(change.message, isMine(kind, change.message));
        if (kind !== 'dm' || isMine(kind, change.message)) break;
        if (document.visibilityState === 'visible') markRead(id);
        else unseenWhileHidden = true;
        break;
      case 'edit':
        log.updateBody(change.id, change.body);
        break;
      case 'delete':
        log.markDeleted(change.id);
        if (editing?.key === change.id && !saving) resetEdit();
        // Someone else deleting a message can change your unread count.
        if (kind === 'dm' && change.senderUid !== me.uid) window.dispatchEvent(new Event('dm:refresh-unread'));
        break;
      case 'file':
        log.note(change.sender ? `${change.sender} shared ${change.filename}.` : `A file was shared: ${change.filename}.`);
        onFileShared(id);
        break;
      case 'error':
        showFormMessage(change.text);
        break;
      default:
        break;
    }
  }

  function follow() {
    if (!current?.loaded) return;
    const { kind, id } = current;
    socket.follow(kinds[kind].topic(id), event => handleEvent(kind, id, event));
  }

  function setHeading(title, subtitle) {
    elements.title.textContent = title;
    elements.subtitle.textContent = subtitle;
  }

  // Returns whether the conversation opens; its messages then load in the background.
  function open(kind, id, { title, subtitle }) {
    if (isOpen(kind, id) && current.loaded) return true;
    if (saving) {
      showFormMessage('Wait for your message to finish saving first.');
      return false;
    }
    const ticket = ++openCount;
    current = { kind, id, loaded: false };
    unseenWhileHidden = false;
    setHeading(title, subtitle);
    resetEdit();
    socket.unfollow();
    log.showEmpty('Loading messages…');
    load(kind, id, ticket);
    return true;
  }

  async function load(kind, id, ticket) {
    let messages;
    try {
      messages = await kinds[kind].load(id);
    } catch (error) {
      if (ticket !== openCount) return;
      console.warn('Messages: could not load the conversation', error);
      log.showEmpty('Could not load these messages', 'Check your connection, then pick the conversation again.');
      return;
    }
    if (ticket !== openCount) return;
    current.loaded = true;
    log.clear();
    if (!messages.length) log.showEmpty('No messages yet', kinds[kind].emptyHint);
    messages.forEach(message => log.append(message, isMine(kind, message)));
    refreshComposer();
    follow();
    if (kind === 'dm') markRead(id);
  }

  function close() {
    openCount += 1;
    current = null;
    socket.unfollow();
    setHeading('Pick a conversation', '');
    log.showEmpty('Pick a conversation', 'Or start a new chat, or find a group to join.');
    resetEdit();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !unseenWhileHidden) return;
    unseenWhileHidden = false;
    if (current?.kind === 'dm') markRead(current.id);
  });

  elements.form.addEventListener('submit', event => {
    event.preventDefault();
    submit();
  });
  elements.cancelEdit.addEventListener('click', resetEdit);
  composer.element.addEventListener('keydown', event => {
    if (event.key === 'Escape' && editing && !saving) {
      event.preventDefault();
      resetEdit();
    }
  });

  close();

  return { open, close, follow, setHeading, current: () => (current ? { kind: current.kind, id: current.id } : null) };
}
