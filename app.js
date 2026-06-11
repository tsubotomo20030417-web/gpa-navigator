let subjectMaster = {};

const recommendationMap = {

"論理的思考":[
"解析Ⅱ",
"線形代数Ⅱ",
"経営工学総論"
],

"数値分析":[
"確率統計学Ⅱ",
"アカウンティング",
"経営数学"
],

"語学力":[
"国際コミュニケーションⅡ",
"言語学"
],

"文章理解":[
"哲学",
"世界史",
"文学"
],

"問題解決":[
"経営学",
"マーケティング",
"テーマ演習"
],

"コミュニケーション":[
"社会心理学",
"観光とコミュニティ"
],

"創造性":[
"アート＆デザイン",
"文化人類学"
]

};

let allSubjects = [];

let selectedSubjects = [];

let radarValues = [
0,
0,
0,
0,
0
];

let radarChart = null;

Papa.parse("subject_master.csv",{

    download:true,

    header:true,

    complete:function(results){

        results.data.forEach(row=>{

           subjectMaster[row.subject] = {

skills:[
row.skill1,
row.skill2
],

group:
row.recommend_group

};

        });

        console.log("CSV読込完了");

        allSubjects =
Object.keys(subjectMaster);

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

suggestions.innerHTML = "";

if(keyword===""){
return;
}

const matches =
allSubjects.filter(subject=>

subject.includes(keyword)

).slice(0,10);

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

searchBox.value = "";

suggestions.innerHTML = "";

};

suggestions.appendChild(div);

});

});
}

function addSubject(subject){

const exists =
selectedSubjects.find(

s=>s.subject===subject

);

if(exists){
return;
}

selectedSubjects.push({

subject:subject,

score:null

});

renderSubjects();

}

function renderSubjects(){

const container =
document.getElementById(
"selectedSubjects"
);

container.innerHTML = "";

selectedSubjects.forEach(

(item,index)=>{

const row =
document.createElement("div");

row.className =
"subject-row";

row.innerHTML =

`
<span>
${item.subject}
</span>

<input
type="number"
placeholder="点数"
value="${item.score ?? ''}"

oninput="
selectedSubjects[${index}].score=
Number(this.value)
">

<button
onclick="
selectedSubjects.splice(
${index},
1
);
renderSubjects();
">

✕

</button>
`;

container.appendChild(row);

});

}

function analyze(){

  if(
selectedSubjects.length===0
){

alert(
"科目を選択してください"
);

return;

}

if(

selectedSubjects.some(
s=>!s.score
)

){

alert(
"点数を入力してください"
);

return;

}

const subjects =
selectedSubjects.map(
s=>s.subject
);

const scores =
selectedSubjects.map(
s=>Number(s.score)
);

let categoryScores = {};

let skillScores = {

"論理的思考":[],
"数値分析":[],
"文章理解":[],
"語学力":[],
"創造性":[],
"問題解決":[],
"コミュニケーション":[]

};

for(let i=0;i<subjects.length;i++){

const category =
subjectMaster[subjects[i]]
?.[0]
|| "その他";

if(!categoryScores[category]){

categoryScores[category] = [];

}

categoryScores[category]
.push(scores[i]);

const skills =
subjectMaster[subjects[i]]
?.skills;

console.log(
subjects[i],
skills
);

if(skills){

skills.forEach(skill=>{

if(skillScores[skill]){

skillScores[skill]
.push(scores[i]);

}

});

}

}

let result = [];

for(let category in categoryScores){

const avg =
categoryScores[category]
.reduce((a,b)=>a+b,0)
/
categoryScores[category].length;

result.push({

category:category,

avg:avg

});

}

radarValues = [

skillScores["論理的思考"].length
?
skillScores["論理的思考"]
.reduce((a,b)=>a+b,0)
/
skillScores["論理的思考"].length
:0,

skillScores["数値分析"].length
?
skillScores["数値分析"]
.reduce((a,b)=>a+b,0)
/
skillScores["数値分析"].length
:0,

skillScores["文章理解"].length
?
skillScores["文章理解"]
.reduce((a,b)=>a+b,0)
/
skillScores["文章理解"].length
:0,

skillScores["語学力"].length
?
skillScores["語学力"]
.reduce((a,b)=>a+b,0)
/
skillScores["語学力"].length
:0,

skillScores["創造性"].length
?
skillScores["創造性"]
.reduce((a,b)=>a+b,0)
/
skillScores["創造性"].length
:0

];

let skillResult = [];

for(let skill in skillScores){

if(skillScores[skill].length){

const avg =

skillScores[skill]
.reduce((a,b)=>a+b,0)

/

skillScores[skill].length;

skillResult.push({

skill:skill,

avg:avg

});

}

}

skillResult.sort(
(a,b)=>b.avg-a.avg
);

const strongestSkill =
skillResult[0];

const predictedCourses =

recommendationMap[
strongestSkill.skill
]

|| [];

console.log("レーダー値");
console.log(radarValues);

result.sort(
(a,b)=>b.avg-a.avg
);

if(result.length===0){

document
.getElementById("result")
.innerText =
"科目を選択してください";

return;

}

const best =

result.find(
r=>r.category!=="その他"
)?.category

|| result[0].category;

let advice = "";

let recommendation = {};

let output =

"🏆 学習特性分析\n\n";

skillResult.forEach(

s=>{

output +=

`${s.skill}
:
${s.avg.toFixed(1)}点\n`;

});

output +=

`\nあなたの強みは
「${strongestSkill.skill}」
です。\n\n`;

output +=

"📈 GPA向上予測\n\n";

predictedCourses.forEach(

course=>{

output +=

`・${course}
（予測${Math.round(strongestSkill.avg)}点）\n`;

});

let output =
"🏆 強み分析\n\n";

result.forEach(r=>{

output +=
`${r.category} : ${r.avg.toFixed(1)}点\n`;

});

output +=
`\nあなたの強みは「${best}」です。\n\n`;

output += "\n📚 おすすめ履修\n";

recommendation.courses.forEach(course=>{

output += `・${course}\n`;

});

output += "\n🎓 おすすめ資格\n";

recommendation.licenses.forEach(license=>{

output += `・${license}\n`;

});

output += "\n💼 おすすめ業界\n";

recommendation.industries.forEach(industry=>{

output += `・${industry}\n`;

});

output += "\n🚀 GPA向上アドバイス\n";

output += recommendation.advice;

output +=

"\n\n📈 GPA向上予測\n";

predictedCourses.forEach(

course=>{

const predictedScore =

Math.round(
strongestSkill.avg
);

output +=

`・${course}
（予測${predictedScore}点）\n`;

});

document
.getElementById("result")
.innerText =
output;

drawRadarChart();

}

function drawRadarChart(){

const ctx =
document.getElementById(
"radarChart"
);

const radarData = {

labels:[
"論理的思考",
"数値分析",
"文章理解",
"語学力",
"創造性"
],

datasets:[{

label:"学習特性",

data:radarValues,

fill:true

}]

};

if(radarChart){

radarChart.destroy();

}

radarChart = new Chart(ctx,{

type:"radar",

data:radarData,

options:{

responsive:true,

scales:{
r:{
min:0,
max:100
}
}

}

});

}