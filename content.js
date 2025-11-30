// ---- Extract username from URL (handles ALL eBay formats) ----
function extractFromURL(url) {
    const u = new URL(url);
    const path = u.pathname.toLowerCase();

    // /str/username
    if (path.includes("/str/")) {
        return path.split("/str/")[1].split("/")[0];
    }

    // /usr/username
    if (path.includes("/usr/")) {
        return path.split("/usr/")[1].split("/")[0];
    }

    // /fdbk/username
    if (path.includes("/fdbk/")) {
        return path.split("/fdbk/")[1].split("/")[0];
    }

    // /sch/username
    if (path.includes("/sch/")) {
        return path.split("/sch/")[1].split("/")[0];
    }

    // ?_ssn=username
    if (u.searchParams.has("_ssn")) {
        return u.searchParams.get("_ssn").toLowerCase();
    }

    return null;
}


// ---- Extract username from DOM ----
function extractFromDOM() {
    // Store homepage store title
    const el = document.querySelector(".x-store-information__store-name a");
    if (el) return extractFromURL(el.href);

    // Feedback profile seller name
    const el2 = document.querySelector(".mbg-nw");
    if (el2) return el2.textContent.trim().toLowerCase();

    return null;
}


// ---- Choose the best username extraction ----
function getEbayUsername() {
    let u = extractFromURL(location.href);
    if (u) return u;

    return extractFromDOM();
}


// ---- Send username to your server ----
async function checkUsername(username) {
    try {
        const res = await fetch(
            "https://sync.mwtakeoffs.com/check-ebay-username?username=" +
            encodeURIComponent(username)
        );

        const data = await res.json();

        if (data.already_exists) {
            alert("❌ This seller was ALREADY contacted: " + username);
        } else {
            alert("✅ SAFE TO MESSAGE — Seller not contacted yet: " + username);
            console.log("New seller saved:", username);
        }

    } catch (err) {
        console.error("API request failed:", err);
        alert("❗ ERROR contacting server. Check console.");
    }
}


// ---- Run on page load ----
(function () {
    const username = getEbayUsername();

    if (!username) {
        alert("⚠️ No seller username found on this page.");
        return;
    }

    checkUsername(username);
})();
