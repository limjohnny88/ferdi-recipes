"use strict";

const _path = _interopRequireDefault(require('path'));
const _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = (Ferdi, settings) => {
  //const getMessages = () => {
    //const inbox = document.querySelector('.topbar-notificationsButton.has-newNotifications');
    //const notificationCount = inbox === null ? 0 : 1;
    //Ferdi.setBadge(0, notificationCount);
  //};
  
  //Ferdi.loop(getMessages);

  window.addEventListener('beforeunload', async () => {
    Ferdi.clearStorageData(settings.id, { storages: ['appcache', 'serviceworkers', 'cachestorage', 'websql', 'indexdb'] });
    Ferdi.releaseServiceWorkers();
  });

  Ferdi.injectCSS(_path.default.join(__dirname, 'service.css'));

  let injectedNotesDarkmodeCSS = false;
  let injectedRemindersDarkmodeCSS = false;
  Ferdi.handleDarkMode((isEnabled, helpers) => {
    if (isEnabled) {
      helpers.enableDarkMode();
      if (!helpers.isDarkModeStyleInjected()) {
        helpers.injectDarkModeStyle();

        // Wait for iframe to load before injecting our custom css
        let iframeNotesCheckInterval = setInterval(function () {
          let iframeDocument = document.getElementById('notes3')?.contentWindow?.document;
          if (iframeDocument && !injectedNotesDarkmodeCSS) {
            const style = iframeDocument.createElement('style');
            style.id = "darkmode-style";
            style.innerHTML = _fs.readFileSync(_path.default.join(__dirname, 'darkmode-iframe.css'), 'utf8');
            iframeDocument.head.append(style);
            injectedNotesDarkmodeCSS = true;
            clearInterval(iframeNotesCheckInterval);
          }
        }, 2000);

        let iframeRemindersCheckInterval = setInterval(function () {
          console.log("debug-iframeRemindersCheckInterval");
          let iframeDocument = document.getElementById('reminders2')?.contentWindow?.document;
          if (iframeDocument && !injectedRemindersDarkmodeCSS) {
            const style = iframeDocument.createElement('style');
            style.id = "darkmode-style";
            style.innerHTML = _fs.readFileSync(_path.default.join(__dirname, 'darkmode-iframe.css'), 'utf8');
            iframeDocument.head.append(style);
            injectedRemindersDarkmodeCSS = true;
            clearInterval(iframeRemindersCheckInterval);
            console.log("debug-iframeRemindersClearInterval");
          }
        }, 2000);

      }
    } else {
      helpers.disableDarkMode();
      helpers.removeDarkModeStyle();

      // Wait for iframe to load before remove our custom css
      var iframeNotesCheckInterval2 = setInterval(function () {
        var iframeDocument = document.getElementById('notes3')?.contentWindow?.document;
        if (iframeDocument && injectedNotesDarkmodeCSS) {
          const style = iframeDocument.getElementById('darkmode-style');
          if (style) {
            style.parentNode.removeChild(style);
            injectedNotesDarkmodeCSS = false;
            clearInterval(iframeNotesCheckInterval2);
          }
        }
      }, 2000);

      var iframeRemindersCheckInterval2 = setInterval(function () {
        var iframeDocument = document.getElementById('reminders2')?.contentWindow?.document;
        if (iframeDocument && injectedRemindersDarkmodeCSS) {
          const style = iframeDocument.getElementById('darkmode-style');
          if (style) {
            style.parentNode.removeChild(style);
            injectedRemindersDarkmodeCSS = false;
            clearInterval(iframeRemindersCheckInterval2);
          }
        }
      }, 2000);

    }
  })
};
