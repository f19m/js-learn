export default function getNewMatrix(cnt) {
  const checkArr = (arr) => {
    let chkArr = []

    let e = arr.indexOf('0');

    for (let i = 0; i < arr.length; i++) {
      let num =arr[i]

      
    }

    return true;
  }


  const sourceArr = [];
  for (let i = 1; i < cnt; i++) {
    sourceArr.push(i.toString());
  }
  sourceArr.push('0');

  [sourceArr[sourceArr.length-2], sourceArr[sourceArr.length-1]]  = [sourceArr[sourceArr.length-1], sourceArr[sourceArr.length-2] ]
  return sourceArr;
  let arr = [];

  for (let i = 0; i < cnt; i++) {
    arr.push(sourceArr.splice(Math.floor(Math.random() * sourceArr.length) ,1)[0]);
  } 

  if (!checkArr(arr)) getNewMatrix(cnt);



  return arr;
}
