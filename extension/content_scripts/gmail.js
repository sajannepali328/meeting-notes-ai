function extractAndDispatchEmailData(targetElement) {
  const composeDialog = targetElement.closest('div[role="dialog"]');
  if (!composeDialog) return;

  // Extract recipients from spans with email attributes
  const recipientEls = composeDialog.querySelectorAll('span[email]');
  const recipients = Array.from(recipientEls).map(el => el.getAttribute('email'));

  const subjectInput = composeDialog.querySelector('input[name="subjectbox"]');
  const subject = subjectInput ? subjectInput.value : '';

  const bodyEl = composeDialog.querySelector('div[aria-label="Message Body"]');
  const body = bodyEl ? bodyEl.innerText : '';

  // Standardized schema designed to accommodate Slack/Zoom events later
  const eventPayload = {
    source: 'GMAIL',
    action: 'EMAIL_SENT',
    data: {
      recipients,
      subject,
      body
    }
  };

  // Dispatch to background script
  chrome.runtime.sendMessage({
    type: 'EVENT_DETECTED',
    payload: eventPayload
  });
}

// Event Delegation on window click
document.addEventListener('click', (e) => {
  const sendButton = e.target.closest('div[data-tooltip*="Send"], div[role="button"][aria-label*="Send"]');
  if (sendButton) {
    extractAndDispatchEmailData(sendButton);
  }
}, true); 