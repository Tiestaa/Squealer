
import {smm, currentVip, QUALITY, MAX_HEIGHT, MAX_WIDTH} from './config.js'
import {useStore} from "vuex";
function getPage(){
    return window.location.pathname.split('/')[2];
}

async function getPosts(query,offset){
    try{
        let res = await fetch(`/db/post/all?${query}&offset=${offset}`,{
            method:"GET",
        });
        let posts =  (await res.json()).map(post => { return {...post, dateOfCreation: new Date(Date.parse(post.dateOfCreation))} });
        return posts;
    }catch (e) {
        throw e
    }
}

async function getUserQuota() {
    try{
        let res = await fetch(`/db/user/quota?user=${currentVip.value}`,{
            method:'GET',
        })
        return (await res.json());
    }
    catch (err) {
        throw err;
    }
}

async function getUserInfo(){
    try{
        let res = await fetch(`/db/user/info?user=${currentVip.value}`,{
            method:'GET',
        })
        return (await res.json());
    }
    catch (err) {
        throw err;
    }
}

async function getLastPost(vipName){
    try{
        let res = await fetch(`/db/user/lastPost?user=${vipName}`,{
            method:'GET',
        })
        return  await res.json();
    }
    catch (err) {
        throw err;
    }
}

//voglio che mi ritorni per ogni una lista di date.
async function getPostsDate(vipname,onlyThisMonth){
    try{
        let res = await fetch(`/db/post/allDates?user=${vipname}&onlyMonth=${onlyThisMonth}`,{
            method:"GET",
        })
        return await res.json();

    }
    catch (err){
        console.log(err);
    }
}

/* IMG TO BASE64 Compressed */
function calculateSize(img, maxWidth, maxHeight) {
    let width = img.width;
    let height = img.height;

    // calculate the width and height, constraining the proportions
    if (width > height) {
        if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
        }
    } else {
        if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
        }
    }
    return [width, height];
}

const blob2base64 = (blob) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
});

const compressBlob = (file) => new Promise((resolve) => {
    let blobURL = URL.createObjectURL(file);
    let compressedImg = new Image();
    compressedImg.src = blobURL;
    compressedImg.onload = () => {
        const [newWidth, newHeight] = calculateSize(compressedImg, MAX_WIDTH, MAX_HEIGHT);
        const canvas = document.createElement('canvas');
        canvas.height = newHeight;
        canvas.width = newWidth;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(compressedImg, 0, 0, newWidth, newHeight);
        canvas.toBlob(blob => {
            resolve(blob);
        },file.type, QUALITY)
    }
})

/**
 *
 * @param {Array<{name:String,destType:String}>} destinations
 * @return {String} - '@francesco, §popi_ma_buoni,'
 */
const parseDestinations = (destinations) => {
    let arr = [];
    destinations.forEach(dest => {
        arr.push(dest.destType === 'channel' ? `§${dest.name}` : `@${dest.name}`)
    })
    return arr.join(', ');
}

function getLast30Days() {
    let arr2ret = [];
    for (let i = 1; i < 31; i++) {
        let day = (new Date(new Date().setDate(new Date().getDate() - (30 - i))));
        arr2ret.push( day.toString().split(' ').slice(1,3).join(' ') )
    }
    return arr2ret;
}

function getLength(reactions){
    Object.keys(reactions).forEach(typeReac => {
        Object.keys(reactions[typeReac]).forEach(date => {
            reactions[typeReac][date] = reactions[typeReac][date].length;
        })
    })
    return reactions
}

function parseReactionDate(reactions){
    Object.keys(reactions).forEach(typeReac => {
        let reac30days = getLast30Days().reduce((accumulator, value) => {
            return {...accumulator, [value]: []};
        }, {});
        reactions[typeReac].forEach(reac => {
            let monthDay = new Date(reac.date).toString().split(' ').slice(1,3).join(' ')
            reac30days[monthDay].push(reac);
        })
        reactions[typeReac] = reac30days;
    })
    return reactions;
}

function parseReactionType(reactions){
    let reactionType = {
        'heart': [],
        'thumbs-up': [],
        'thumbs-down': [],
        'heartbreak': []
    }
    reactions.forEach(reac => {
        reactionType[reac.rtype].push(reac);
    })
    return reactionType;
}

export{
    getPage,
    getPosts,
    getUserQuota,
    getUserInfo,
    getLastPost,
    blob2base64,
    compressBlob,
    getPostsDate,
    parseDestinations,
    parseReactionDate,
    parseReactionType,
    getLength,
    getLast30Days
}