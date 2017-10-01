hljs.initHighlightingOnLoad();
hljs.configure({   // optionally configure hljs
  languages: ['javascript', 'html', 'css']
});
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{'header': 1}, {'header': 2}],
  [{'script': 'sub'}, {'script': 'super'}],
  [{'indent': '-1'}, {'indent': '+1'}],
  [{'list': 'ordered'}, {'list': 'bullet'}],
  [{'size': ['small', false, 'large', 'huge']}],
  [{'header': [3,4,5,6,false]}],
  [{'color': []}, {'background': []}],
  [{'font': []}],
  [{'align': []}],
  ['link', 'blockquote', 'code-block', 'image'],
  ['clean']
];

const quill = new Quill('#editor', {
  modules: {
    syntax: true,
    toolbar: toolbarOptions
  },
  theme: 'snow'
});

quill.on('text-change', function(delta, oldDelta, source) {
  console.log('Delta', delta);
  console.log('Old Delta', oldDelta);
  console.log('Source', source);
  const content = quill.container.firstChild.innerHTML;
});