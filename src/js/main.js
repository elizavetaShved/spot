import polyfills from './polyfills';
import './lazyload';
import detectTouch from './detectTouch';
import setScrollbarWidth from './setScrollbarWidth';
import validation from './validation';
import customSelects from './customSelects';
import phoneMask from './phoneMask';
import onlyNumeric from './onlyNumeric';
import fileUpload from './fileUpload';
import componentTalentsList from './componentTalentsList';

document.addEventListener('DOMContentLoaded', function () {
  polyfills();
  detectTouch();
  setScrollbarWidth();
  validation();
  customSelects();
  phoneMask();
  onlyNumeric();
  fileUpload();

  componentTalentsList();
});

window.addEventListener('load', function () {
  document.body.classList.add('loaded');
  setTimeout(() => document.body.classList.add('animatable'), 300)
})
