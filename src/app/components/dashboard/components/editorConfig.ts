import { AngularEditorConfig } from '@kolkov/angular-editor';

interface ExtendedAngularEditorConfig extends AngularEditorConfig {
  fontSizes?: { value: string; name: string }[];
}

export const editorConfig: ExtendedAngularEditorConfig = {
  editable: true,
  spellcheck: true,
  height: 'auto',
  minHeight: '0',
  maxHeight: 'auto',
  width: 'auto',
  minWidth: '0',
  translate: 'yes',
  enableToolbar: true,
  showToolbar: true,
  placeholder: 'Enter text here...',
  defaultParagraphSeparator: '',
  defaultFontName: '',
  defaultFontSize: '',
  fonts: [
    { class: 'arial', name: 'Arial' },
    { class: 'calibri', name: 'Calibri' },
    { class: 'georgia', name: 'Georgia' },
    { class: 'helvetica', name: 'Helvetica' },
    { class: 'courier-new', name: 'Courier New' },
    { class: 'verdana', name: 'Verdana' },
    { class: 'tahoma', name: 'Tahoma' },
    { class: 'trebuchet-ms', name: 'Trebuchet MS' },
    { class: 'impact', name: 'Impact' },
  ],
  uploadUrl: 'v1/image',
  uploadWithCredentials: false,
  sanitize: true,
  toolbarPosition: 'top',
  toolbarHiddenButtons: [
    ['insertImage', 'insertVideo'],
    ['textStyle'],
    ['html'],
    ['unlink'],
    // ['fontSize']
  ],
  fontSizes: Array.from({ length: 20 }, (_, i) => i + 1).map(size => ({
    value: size.toString(),
    name: size.toString()
  }))
};

