let subjectMaster = {};

let allSubjects = [];

let selectedSubjects = [];

Papa.parse("subject_master_en.csv",{

download:true,

header:true,

complete:function(results){

results.data.forEach(row=>{

subjectMaster[row.subject] = {

skills:[
row.skill1,
row.skill2
]

};

allSubjects.push(
row.subject
);

});

initializeSearch();

}

});

function initializeSearch(){

const searchBox =
document.getElementById(
"subjectSearch"
);

searchBox.addEventListener(
"input",
function(){

const keyword =
this.value.trim();

const suggestions =
document.getElementById(
"suggestions"
);

suggestions.innerHTML="";

if(keyword===""){
return;
}

const matches =

allSubjects.filter(

s=>

s.toLowerCase()
.includes(
keyword.toLowerCase()
)

);

matches.forEach(subject=>{

const div =
document.createElement("div");

div.className =
"suggestion";

div.innerText =
subject;

div.onclick =

function(){

addSubject(subject);

searchBox.value="";

suggestions.innerHTML="";

};

suggestions.appendChild(div);

});

});

}

function addSubject(subject){

selectedSubjects.push({

subject:subject,

});

renderSubjects();

}

function renderSubjects(){

const container =
document.getElementById(
"selectedSubjects"
);

container.innerHTML="";

selectedSubjects.forEach(

(item,index)=>{

const div =
document.createElement("div");

div.innerHTML =

`
${item.subject}
`;

container.appendChild(div);

});

}

function analyze(){

const skillScores = {

"Business":[],
"Technology":[],
"Culture":[],
"Japanese Society":[],
"Communication":[],
"Science":[],
"Creativity":[]

};

selectedSubjects.forEach(item=>{

const skills =

subjectMaster[
item.subject
].skills;

skills.forEach(skill=>{

skillScores[
skill
].push(1);

});

});

const result=[];

for(const skill in skillScores){

if(
skillScores[skill].length>0
){

console.log(
skill,
skillScores[skill]
);

const avg =

skillScores[skill]
.length;

result.push({

skill:skill,
avg:avg

});

}

}

result.sort(
(a,b)=>b.avg-a.avg
);

const strongest =
result[0];

const placeMap = {

"Culture":{

name:"Sankeien Garden",

reason:
"Learn traditional Japanese culture and architecture.",

image:
"images/sankeien.jpg",

map:
"https://maps.google.com/?q=Sankeien+Garden"

},

"Technology":{

name:"Miraikan",

reason:
"Explore robotics, AI and future technologies.",

image:
"images/miraikan.jpg",

map:
"https://maps.google.com/?q=Miraikan"

},

"Business":{

name:"Minato Mirai",

reason:
"Experience Japanese business and urban development.",

image:
"images/minatomirai.jpg",

map:
"https://maps.google.com/?q=Minato+Mirai"

},

"Japanese Society":{

name:"Yokohama Chinatown",

reason:
"Observe cultural diversity in Japan.",

image:
"images/chinatown.jpg",

map:
"https://maps.google.com/?q=Yokohama+Chinatown"

},

"Communication":{

name:"Yokohama Chinatown",

reason:
"Interact with people from diverse cultural backgrounds.",

image:
"images/chinatown.jpg",

map:
"https://maps.google.com/?q=Yokohama+Chinatown"

},

"Science":{

name:"Miraikan",

reason:
"Discover Japanese scientific achievements and innovation.",

image:
"images/miraikan.jpg",

map:
"https://maps.google.com/?q=Miraikan"

},

"Creativity":{

name:"teamLab Planets",

reason:
"Experience world-famous Japanese digital art.",

image:
"images/teamlab.jpg",

map:
"https://maps.google.com/?q=teamLab+Planets"

}

};

const place =

placeMap[
strongest.skill
];

let output="";

output +=
"🏆 Learning Profile\n\n";

result.forEach(r=>{

output +=

`${r.skill}: ${r.avg.toFixed(1)}\n`;

});

output +=

`\nStrongest Interest:
${strongest.skill}\n\n`;

output +=

"🌏 Recommended Place\n\n";

if(place){

output +=

`📍 ${place.name}\n`;

output +=

`${place.reason}\n\n`;

}else{

output +=

"No recommendation available.\n\n";

}

output +=

"📚 Why This Place?\n\n";

if(place){

output +=

`This location is connected to your academic interests in ${strongest.skill}.

Visiting this place can help deepen your understanding beyond the classroom.\n`;

}

if(place){

document
.getElementById("placeImage")
.innerHTML=

`<img
src="${place.image}"
style="
width:100%;
max-width:600px;
border-radius:12px;
margin-bottom:20px;
">`;

document
.getElementById("mapButton")
.innerHTML=

`<a
href="${place.map}"
target="_blank"
class="map-btn">

📍 Open Google Maps

</a>`;

}else{

document
.getElementById("placeImage")
.innerHTML = "";

document
.getElementById("mapButton")
.innerHTML = "";
}

document
.getElementById("result")
.innerText =
output;
}