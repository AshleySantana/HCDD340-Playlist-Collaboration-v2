//NAV BAR
function toSearchPage(){
    window.location.href = "search-song.html"
 }
 
 function toLibraries(){
     window.location.href = "libraries.html"
 }
 
 function toHome(){
     window.location.href = "home.html"
 }
 // END OF NAV BAR
 
 function toExamplePlaylist(){
    window.location.href = "kpopExamplePlaylist.html"
 }
 // List of songs 
 const albumsList = [
     {
         title: "The King of Limbs",
         artist: "Radiohead",
         image: "images/king_of_limbs.jpg",
         songs: [
             { title: "Bloom", length: "5:15" },
             { title: "Morning Mr Magpie", length: "4:41" },
             { title: "Little by Little", length: "4:27" },
             { title: "Feral", length: "3:13" },
             { title: "Lotus Flower", length: "5:01" },
             { title: "Codex", length: "4:47" },
             { title: "Give Up the Ghost", length: "4:50" },
             { title: "Separator", length: "5:20" }
         ]
     },
     {
         title: "OK Computer",
         artist: "Radiohead",
         image: "images/ok_computer.jpg",
         songs: [
             { title: "Airbag", length: "4:44" },
             { title: "Paranoid Android", length: "6:23" },
             { title: "Subterranean Homesick Alien", length: "4:27" },
             { title: "Exit Music (For a Film)", length: "4:24" },
             { title: "Let Down", length: "4:59" },
             { title: "Karma Police", length: "4:21" },
             { title: "Fitter Happier", length: "1:57" },
             { title: "Electioneering", length: "3:50" },
             { title: "Climbing Up the Walls", length: "4:45" },
             { title: "No Surprises", length: "3:48" },
             { title: "Lucky", length: "4:19" },
             { title: "The Tourist", length: "5:24" }
         ]
     },
     {
         title: "Dummy",
         artist: "Portishead",
         image: "images/dummy.png",
         songs: [
             { title: "Mysterons", length: "5:02" },
             { title: "Sour Times", length: "4:11" },
             { title: "Strangers", length: "3:55" },
             { title: "It Could Be Sweet", length: "4:16" },
             { title: "Wandering Star", length: "4:51" },
             { title: "It's a Fire", length: "3:49" },
             { title: "Numb", length: "3:54" },
             { title: "Roads", length: "5:02" },
             { title: "Pedestal", length: "3:39" },
             { title: "Biscuit", length: "5:01" },
             { title: "Glory Box", length: "5:06" }
         ]
     },
     {
         title: "Third",
         artist: "Portishead",
         image: "images/third.jpg",
         songs: [
             { title: "Silence", length: "4:58" },
             { title: "Hunter", length: "3:57" },
             { title: "Nylon Smile", length: "3:16" },
             { title: "The Rip", length: "4:29" },
             { title: "Plastic", length: "3:27" },
             { title: "We Carry On", length: "6:27" },
             { title: "Deep Water", length: "1:31" },
             { title: "Machine Gun", length: "4:43" },
             { title: "Small", length: "6:45" },
             { title: "Magic Doors", length: "3:32" },
             { title: "Threads", length: "5:45" }
         ]
     }
 ];
 
 // HOME PAGE CODE:
 // this is for the results section
 albumsList.forEach(p => {
     const item = document.createElement("div");
     const recentSongs = document.getElementById("recentSongs")
     item.className = "card";
     item.tabIndex = 0;                     // makes it keyboard-focusable
     item.setAttribute("role", "button");   // semantic for assistive tech
     item.setAttribute("aria-pressed", "false");
   
     // Use background-image for a cleaner square cover, but if you prefer <img> you can swap.
     item.innerHTML = `
       <div class="cover" style="background-image: url('${p.image || ''}');">
         ${!p.image ? '<img src="fallback.jpg" alt="cover">' : ''}
       </div>
       <div class="meta">
         <p class="title">${p.title}</p>
         <p class="artist">${p.artist}</p>
       </div>
     `;
     // toggle selected on click
   item.addEventListener("click", () => {
     const isSelected = item.classList.toggle("selected");
     item.setAttribute("aria-pressed", String(isSelected));
   });
   // keyboard support: Space or Enter toggles selection
   item.addEventListener("keydown", (e) => {
     if (e.key === "Enter" || e.key === " ") {
       item.click();
     }
   });
     recentSongs.appendChild(item);
 
 });
 // END OF HOME PAGE CODE
