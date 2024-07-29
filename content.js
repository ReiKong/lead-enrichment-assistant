document.addEventListener("DOMContentLoaded", function() {
    var formatting = document.getElementById("formatting");
    var defaultLinks = document.getElementById("defaultLinks");
    var iconLinks = document.getElementById("iconLinks");

    formatting.addEventListener("click", async () => {
        // Get current active tab
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        // Execute script to open links on the page
        chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: doFormatting,
        });
    })

    // Format name, company, and phone number
    function doFormatting() {
        // Click the paintbrushes
        const paintbrushes = document.querySelectorAll("span.absolute.h-4.w-4.-right-5.inset-y-7");
        for (const paintbrush of paintbrushes) {
            const svg = paintbrush.querySelector("svg");
            const color = svg.getAttribute("fill");
            if (svg.getAttribute("fill") === "#2F80ED") {
                paintbrush.click();
            }
        }
    }

    defaultLinks.addEventListener("click", async () => {
        // Get current active tab
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        // Get list of links in current window
        const linksResult = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: getDefaultLinks,
        });

        var links = linksResult[0].result;

        chrome.runtime.sendMessage({ action: "createWindow" }, async (response) => {
            const newWindowId = response.windowId;
            
            let [newTab] = await chrome.tabs.query({windowId: newWindowId});                            // Gets empty tab

            for (let i = 1; i < links.length; i++) {
                const link = links[i];
                console.log("Opening" + link);
                chrome.tabs.create({ url: link, windowId: newWindowId, active: (i === 0) });            // Opens default link in a new tab
            }

            chrome.tabs.remove(newTab.id);                                                              // Removes first empty tab
        });

    });

    function getDefaultLinks() {
        const linksNodeList = document.getElementsByClassName("lead-links");

        // Convert NodeList to Array and extract href attributes
        const linksArray = Array.from(linksNodeList).map(link => link.href);

        return linksArray.slice();
    }

    function openLinks(links, windowId) {
        for (let i = 1; i < links.length; i++) {
            const link = links[i];
            console.log("Opening" + link)
            chrome.tabs.create({ url: link, windowId: newWindowId, active: (i === 0) });
        }
    }

    iconLinks.addEventListener("click", async () => {
        // Get current active tab
        let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
        
        // Get list of links in current window
        const linksResult = await chrome.scripting.executeScript({
            target: {tabId: tab.id},
            func: getIconLinks,

        });

        var links = linksResult[0].result;

        chrome.runtime.sendMessage({ action: "createWindow" }, async (response) => {
            const newWindowId = response.windowId;
            
            let [newTab] = await chrome.tabs.query({windowId: newWindowId});                            // Gets empty tab

            for (let i = 1; i < links.length; i++) {
                const link = links[i];
                console.log("Opening" + link);
                chrome.tabs.create({ url: link, windowId: newWindowId, active: (i === 0) });            // Opens default link in a new tab
            }

            chrome.tabs.remove(newTab.id);                                                              // Removes first empty tab
        });

    });


    function getIconLinks() {
        const anchorElements = document.querySelectorAll("a");
        const links = [];

        for (const anchorElement of anchorElements) {
            const svgElement = anchorElement.querySelector("svg");              // Check if the <a> element has an <svg> child
        
            if (svgElement) {                                                   // If an <svg> element is found, open link
                links.push(anchorElement.getAttribute("href"));
            }
        }

        return links;
    }

    /* 
    function getNonprofitLinks() {
        // Open Company 990 form link
        // If ProPublica, open tab
        // Open View Filing in new tab
        // Else if Cause IQ, open tab
    }
    */
});
