// main.ts

import { initializeApp } from 'firebase/app'; import { getAuth, onAuthStateChanged } from 'firebase/auth'; import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'; import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = { apiKey: 'AIzaSyB8DFd227dgvCh9TKZ3pe3I0tdDd9MIHp0', authDomain: 'anointed-flames-tv.firebaseapp.com', projectId: 'anointed-flames-tv', storageBucket: 'anointed-flames-tv.appspot.com', messagingSenderId: '814825501586', appId: '1:814825501586:web:3fb1feb13746bce2e1c74b', measurementId: 'G-CZR5508L92' };

const app = initializeApp(firebaseConfig); const auth = getAuth(app); const db = getFirestore(app); const storage = getStorage(app);

const homeIcon = document.getElementById('home-icon')!; const videoIcon = document.getElementById('video-icon')!; const menuIcon = document.getElementById('menu-icon')!;

const feedContainer = document.getElementById('feed')!; const videoContainer = document.getElementById('videos')!;

function createAdBlock(): string { return <div class="bg-yellow-100 text-yellow-800 p-2 rounded shadow text-sm mb-2"> Ad: Support us by clicking sponsored content below. </div>; }

function displayPost(doc: any) { const post = doc.data(); const postEl = document.createElement('div'); postEl.className = 'bg-white rounded shadow p-4 mb-4'; postEl.innerHTML = ${createAdBlock()} <div class="flex items-center mb-2"> <img src="${post.userPhoto || '/default-avatar.jpg'}" class="w-8 h-8 rounded-full mr-2"> <div> <p class="font-semibold">${post.userName}</p> <p class="text-xs text-gray-500">${new Date(post.timestamp?.toDate()).toLocaleString()}</p> </div> </div> <p class="mb-2">${post.content}</p> ${post.imageUrl ?<img src="${post.imageUrl}" class="w-full rounded mb-2">: ''} ${post.videoUrl ?<video src="${post.videoUrl}" class="w-full rounded mb-2" controls></video>: ''} <div class="flex space-x-4 text-sm text-gray-600"> <button class="hover:underline">Like</button> <button class="hover:underline">Comment</button> <button class="hover:underline">Share</button> </div>; feedContainer.appendChild(postEl); }

async function loadPosts() { feedContainer.innerHTML = ''; const querySnapshot = await getDocs(collection(db, 'posts')); querySnapshot.forEach((doc) => { displayPost(doc); }); }

onAuthStateChanged(auth, user => { if (user) { loadPosts(); } });

// Facebook-style Post Composer Logic const openPostBox = document.getElementById('open-post-box')!; const fullPostBox = document.getElementById('full-post-box')!; const fileInput = document.getElementById('file-input') as HTMLInputElement; const submitBtn = document.getElementById('submit-post')!; const previewImage = document.getElementById('image-preview') as HTMLImageElement; const previewVideo = document.getElementById('video-preview') as HTMLVideoElement; const previewBox = document.getElementById('preview-media')!; const postText = document.getElementById('post-text') as HTMLTextAreaElement;

openPostBox.addEventListener('click', () => fullPostBox.classList.toggle('hidden'));

fileInput.addEventListener('change', () => { const file = fileInput.files?.[0]; if (!file) return; const reader = new FileReader();

reader.onload = (e) => { const result = e.target?.result as string; previewBox.classList.remove('hidden');

if (file.type.startsWith('image')) {
  previewImage.src = result;
  previewImage.classList.remove('hidden');
  previewVideo.classList.add('hidden');
} else if (file.type.startsWith('video')) {
  previewVideo.src = result;
  previewVideo.classList.remove('hidden');
  previewImage.classList.add('hidden');
}

}; reader.readAsDataURL(file); });

submitBtn.addEventListener('click', async () => { const text = postText.value.trim(); if (!text) return alert('Please write something.');

const file = fileInput.files?.[0]; let mediaUrl = '', mediaType = '';

if (file) { const storageRef = ref(storage, posts/${Date.now()}-${file.name}); await uploadBytes(storageRef, file); mediaUrl = await getDownloadURL(storageRef); mediaType = file.type.startsWith('image') ? 'image' : 'video'; }

const user = auth.currentUser; if (!user) return alert('Please sign in');

await addDoc(collection(db, 'posts'), { userId: user.uid, userName: user.displayName, userPhoto: user.photoURL, content: text, imageUrl: mediaType === 'image' ? mediaUrl : '', videoUrl: mediaType === 'video' ? mediaUrl : '', timestamp: serverTimestamp(), status: 'pending', });

alert('Your post has been submitted for approval.'); postText.value = ''; fileInput.value = ''; fullPostBox.classList.add('hidden'); previewBox.classList.add('hidden'); });

homeIcon.addEventListener('click', () => { feedContainer.classList.remove('hidden'); videoContainer.classList.add('hidden'); });

videoIcon.addEventListener('click', () => { feedContainer.classList.add('hidden'); videoContainer.classList.remove('hidden'); });

menuIcon.addEventListener('click', () => { alert('Menu opened (future settings, profile, logout, etc.)'); });
