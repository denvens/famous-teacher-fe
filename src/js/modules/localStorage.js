export default {
  setStorage (ele, value) {
    window.localStorage.setItem(ele, value);
  },
  getStorage (ele) {
    return window.localStorage.getItem(ele);
  }
}