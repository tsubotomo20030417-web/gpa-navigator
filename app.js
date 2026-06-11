let subjectMaster = {};

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

            subjectMaster[row.subject]
=
[
row.skill1,
row.skill2
];

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
|| "その他";

if(!categoryScores[category]){

categoryScores[category] = [];

}

categoryScores[category]
.push(scores[i]);

const skills =
subjectMaster[subjects[i]];

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

if(best==="計算系"){

recommendation = {

courses:[
"統計学Ⅱ",
"機械学習",
"データ分析"
],

licenses:[
"統計検定2級",
"基本情報技術者",
"データサイエンス検定"
],

industries:[
"IT",
"金融",
"コンサル"
],

advice:
"計算系科目で高得点を維持しています。次学期も計算系科目を中心に履修すると高いGPAが期待できます。"

};

}

else if(best==="語学系"){

recommendation = {

courses:[
"異文化コミュニケーション",
"国際関係論",
"ビジネス英語"
],

licenses:[
"TOEIC",
"HSK",
"IELTS"
],

industries:[
"商社",
"航空",
"観光"
],

advice:
"語学系に強みがあります。国際系科目を履修することで学習成果をさらに高められます。"

};

}

else if(best==="社会科学系"){

recommendation = {

courses:[
"経営戦略",
"マーケティング",
"国際経済"
],

licenses:[
"日商簿記",
"FP",
"中小企業診断士"
],

industries:[
"金融",
"メーカー",
"コンサル"
],

advice:
"社会科学系科目との相性が良好です。専門科目を増やすことで高GPAが期待できます。"

};

}

else if(best==="人文系"){

recommendation = {

courses:[
"文化人類学",
"歴史学",
"哲学応用"
],

licenses:[
"学芸員",
"日本語教育能力検定"
],

industries:[
"教育",
"出版",
"文化事業"
],

advice:
"人文系分野に強みがあります。読解・考察型科目を中心に履修することを推奨します。"

};

}

else{

recommendation = {

courses:[
"専門関連科目"
],

licenses:[
"関連資格"
],

industries:[
"関連業界"
],

advice:
"さらに履修データを増やすことで精度が向上します。"

};

}


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