export const sendChromeMessage = (targetId: string, message: any) => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(targetId, message, (response) => {
      if (response) {
        resolve(response)
      } else {
        reject(chrome.runtime.lastError)
      }
    })
  })
}
