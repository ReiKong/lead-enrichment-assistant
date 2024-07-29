chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "createWindow") {
        console.log("Creating new window")
        chrome.windows.create({
            type: "normal",
            focused: true,
        }, (newWindow) => {
            sendResponse({ windowId: newWindow.id });
        });
    }
    return true;
});
