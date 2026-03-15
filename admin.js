import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { 
getFirestore, collection, getDocs, doc, updateDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

import { 
getAuth, signOut 
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";


const firebaseConfig = {
apiKey: "AIzaSyCnSo34D6diIreXIpRiTGxOIrI8gDNwNik",
authDomain: "stocker-trade.firebaseapp.com",
projectId: "stocker-trade",
storageBucket: "stocker-trade.firebasestorage.app",
messagingSenderId: "344733501351",
appId: "1:344733501351:web:e32df233651499ccc75882"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


async function loadAdminData(){

const usersSnapshot = await getDocs(collection(db,"users"));

const userTable = document.getElementById("userTable");
const depositTable = document.getElementById("depositTable");
const withdrawTable = document.getElementById("withdrawTable");

userTable.innerHTML="";
depositTable.innerHTML="";
withdrawTable.innerHTML="";

usersSnapshot.forEach((docSnap)=>{

const data = docSnap.data();
const uid = docSnap.id;

let balance = data.balance || 0;

userTable.innerHTML += `
<tr>
<td>${data.fullName}</td>
<td>${data.email}</td>
<td>$${balance}</td>
<td>-</td>
</tr>
`;


if(data.depositRequests){

data.depositRequests.forEach((req,index)=>{

depositTable.innerHTML += `
<tr>
<td>${data.fullName}</td>
<td>$${req.amount}</td>
<td>${req.status}</td>
<td>
<button class="btn btn-success btn-sm"
onclick="approveDeposit('${uid}',${req.amount})">
Approve
</button>
</td>
</tr>
`;

});

}


if(data.withdrawRequests){

data.withdrawRequests.forEach((req,index)=>{

withdrawTable.innerHTML += `
<tr>
<td>${data.fullName}</td>
<td>$${req.amount}</td>
<td>${req.status}</td>
<td>
<button class="btn btn-danger btn-sm"
onclick="approveWithdraw('${uid}',${req.amount})">
Approve
</button>
</td>
</tr>
`;

});

}

});

}


window.approveDeposit = async function(uid,amount){

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);

let balance = snap.data().balance || 0;

await updateDoc(userRef,{
balance: balance + amount
});

alert("Deposit Approved");

loadAdminData();

}


window.approveWithdraw = async function(uid,amount){

const userRef = doc(db,"users",uid);

const snap = await getDoc(userRef);

let balance = snap.data().balance || 0;

if(balance < amount){
alert("User has insufficient balance");
return;
}

await updateDoc(userRef,{
balance: balance - amount
});

alert("Withdrawal Approved");

loadAdminData();

}


window.logout = async function(){

await signOut(auth);

window.location.href="../index.html";

}

loadAdminData();