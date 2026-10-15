"""Exercise the shared project template in workspace paths containing spaces."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest


TEMPLATE = Path(__file__).resolve().parents[1] / '_projects/_template/Makefile'


@unittest.skipUnless(shutil.which('make') and sys.platform != 'win32', 'Run under Linux/WSL with Make')
class ProjectMakefilePathsTest(unittest.TestCase):
    def test_server_wait_accepts_ready_log_and_honors_timeout(self):
        with tempfile.TemporaryDirectory(prefix='CSA Folder ') as directory:
            root = Path(directory)
            shutil.copyfile(TEMPLATE.parents[2] / 'Makefile', root / 'Makefile')
            log = root / 'server output.log'
            command = ['make', 'wait-for-server', f'LOG_FILE={log}', 'STARTUP_TIMEOUT=0']
            log.write_text('Generating...\n')
            result = subprocess.run(command, cwd=root, text=True, capture_output=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('Server timed out after 0 seconds', result.stdout)
            log.write_text('Server address: http://localhost:4501/\n')
            result = subprocess.run(command, cwd=root, text=True, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
            self.assertIn('Server started', result.stdout)

    def test_flat_and_nested_projects_in_workspace_with_spaces(self):
        for relative in ('_projects/sample-game', '_projects/games/sample-game'):
            with self.subTest(project=relative), tempfile.TemporaryDirectory(prefix='CSA Folder ') as directory:
                root = Path(directory)
                project = root / relative
                project.mkdir(parents=True)
                (root / 'Makefile').touch()
                shutil.copyfile(TEMPLATE, project / 'Makefile')
                python = root / 'venv/bin/python3'
                python.parent.mkdir(parents=True)
                python.symlink_to(sys.executable)
                scripts = root / 'scripts'
                scripts.mkdir()
                (scripts / 'convert_notebooks.py').write_text(
                    'import json, sys\nfrom pathlib import Path\n'
                    'Path("conversion.json").write_text(json.dumps(sys.argv[1:]))\n'
                )
                sources = {
                    'index.md': '---\nlayout: post\n---\nSample',
                    'navigation/page.html': '<p>navigation</p>',
                    'navigation/page.md': 'navigation',
                    'js/main.js': 'const sample = 1;',
                    'levels/level.js': 'const level = 1;',
                    'images/sample image.png': 'image fixture',
                    'sass/main.scss': 'body { color: red; }',
                    'docs/guide.md': 'guide',
                    'notebooks/lesson name.ipynb': '{}',
                }
                for name, content in sources.items():
                    target = project / name
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_text(content)

                def make(*targets):
                    result = subprocess.run(['make', *targets], cwd=project, text=True, capture_output=True)
                    self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

                make('build', 'docs')
                self.assertEqual((root / 'assets/js/projects/sample-game/main.js').read_text(), sources['js/main.js'])
                self.assertTrue((root / 'assets/js/projects/sample-game/levels/level.js').is_file())
                self.assertTrue((root / 'images/projects/sample-game/sample image.png').is_file())
                self.assertTrue((root / '_includes/projects/sample-game/page.html').is_file())
                self.assertTrue((root / '_posts/projects/sample-game/2026-04-15-sample-game-guide.md').is_file())
                args = json.loads((root / 'conversion.json').read_text())
                self.assertEqual(args[args.index('--project') + 1], str(project))
                self.assertFalse((project / 'sample-game').exists(), 'No stray copied directory in source')
                output = root / '_posts/projects/2026-04-15-sample-game.md'
                modified = output.stat().st_mtime_ns
                make('build')
                self.assertEqual(output.stat().st_mtime_ns, modified, 'Unchanged index is not rewritten')
                make('convert-single', 'NOTEBOOK_FILE=notebooks/lesson name.ipynb')
                args = json.loads((root / 'conversion.json').read_text())
                self.assertEqual(args[0], str(project / 'notebooks/lesson name.ipynb'))


if __name__ == '__main__':
    unittest.main()
