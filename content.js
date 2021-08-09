if(!localStorage.getItem("playerSteam64")) {
var staffID32 = prompt("A steam ID is required to begin tracking your sit stats(STEAM_0:0:XXXXXXXX):")
if(steam.IsSteamID32(staffID32.trim())) localStorage.setItem("playerSteam64", steam.SteamIDTo64(staffID32.trim()));
}
function getSitStats() {
    var sitStatsJSON = {};
    var staff
    if (localStorage.getItem("sitStatsJSON")) sitStatsJSON = JSON.parse(localStorage.getItem("sitStatsJSON"));
        fetch(`https://superiorservers.co/api/profile/sits/${localStorage.getItem("playerSteam64")}`).then(sitStats => sitStats.json()).then((sitStats) => {
            let dateYear = new Date().getFullYear();
            sitStats = sitStats.response;
            for(var i = 1; i < sitStats.length; i++) {// i = 1, skips the total
            var sitTag = sitStats[i].label.toUpperCase() + "-" + dateYear.toString();
            sitStatsJSON[sitTag] = sitStats[i].count;
            }
            console.log(sitStatsJSON);
            localStorage.setItem("sitStatsJSON", JSON.stringify(sitStatsJSON));
    }).catch((error) => {
        console.error("An error occoured when grabbing your sit stats!\n\n" + error);
    });

}
getSitStats();

if (location.href.split("/")[4].includes(localStorage.getItem("playerSteam64"))) {
    document.getElementsByTagName("title")[0].innerHTML = "Profile - Recording Sits";
        function updateSitsUI() {
            const dateThreeMonths = new Date().setMonth(new Date().getMonth()-1); // 3 months ago
            const dateLastMonth = new Date().setMonth(new Date().getMonth()-2); // 3 months ago
            const dateFormatter = new Intl.DateTimeFormat('en', {month: 'long'});
            var sitStats = JSON.parse(localStorage.getItem("sitStatsJSON"));
            var lastMonth = dateFormatter.format(dateLastMonth).toUpperCase() + "-" + new Date().getFullYear();
            var currentMonth = dateFormatter.format(new Date()).toUpperCase() + "-" + new Date().getFullYear();
            var ThreeMonthsAgo = dateFormatter.format(dateThreeMonths).toUpperCase() + "-" + new Date().getFullYear()
            for(var sitMonth in sitStats) {
            if(sitMonth == lastMonth || sitMonth == currentMonth || sitMonth == ThreeMonthsAgo) continue;
            var statElem = document.createElement("div")
            statElem.classList.add("stat");
            statElem.innerHTML = `
            <div class="human-readable-number">${sitStats[sitMonth]}</div>
            <span class="stat-label">${sitMonth}</span>
            `
            document.querySelector("#app > div:nth-child(2) > div > div:nth-child(2) > div.panel-body > div > div:nth-child(2) > div").appendChild(statElem);
        }
    }
    var waitForSits = setInterval(function(){
        if(document.querySelector("#app > div:nth-child(2) > div > div:nth-child(2) > div.panel-body > div > div:nth-child(2) > div")) {
            updateSitsUI();
            clearInterval(waitForSits);
        }
    }, 200);

    console.log("test");
    var dropDownMenuElem = document.getElementsByClassName("dropdown-menu")[3];
    var dropDownItemElem = document.createElement("li");
    var dropDownButtonElem = document.createElement("button");
    dropDownButtonElem.innerHTML = "Reset Sit Stats";
    dropDownButtonElem.setAttribute("onclick", "localStorage.removeItem('playerSteam64'); localStorage.removeItem('sitStatsJSON'); location.reload();")
    dropDownButtonElem.style.cssText = `
    display: inherit;
    color: red;
    background: inherit;
    border: inherit;
    padding: 3px 20px;
    margin: inherit;
    position: inherit;
    `
    dropDownItemElem.appendChild(dropDownButtonElem);
    dropDownMenuElem.appendChild(dropDownItemElem);
}