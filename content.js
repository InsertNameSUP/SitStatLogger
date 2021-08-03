if(!localStorage.getItem("playerSteam64")) {
var staffID32 = prompt("A steam ID is required to begin tracking your sit stats(STEAM_0:0:XXXXXXXX):")
if(steam.IsSteamID32(staffID32.trim())) localStorage.setItem("playerSteam64", steam.SteamIDTo64(staffID32));
}
function updateSitStats() {
    var sitStatsJSON = {};
    var staff
    if (localStorage.getItem("sitStatsJSON")) sitStatsJSON = JSON.parse(localStorage.getItem("sitStatsJSON"));
        fetch(`https://superiorservers.co/api/profile/sits/${localStorage.getItem("playerSteam64")}`).then(sitStats => sitStats.json()).then((sitStats) => {
            var dateYear = new Date().getFullYear();
            sitStats = sitStats.response;
            for(var i = 1; i < sitStats.length; i++) {// i = 1, skips the total
            var sitTag = sitStats[i].label.toUpperCase() + "-" + dateYear.toString();
            if(sitStatsJSON[sitTag]) continue; // If month is already logged, skip.
            sitStatsJSON[sitTag] = sitStats[i].count;
            }
            console.log(sitStatsJSON);
            localStorage.setItem("sitStatsJSON", JSON.stringify(sitStatsJSON));
    });

}
updateSitStats();