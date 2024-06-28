export async function getAPI (url){
  let controller = new AbortController();
  let fetchAbort = setTimeout(()=> controller.abort() , 5000);
 try {
    const response = await fetch(url , {signal : controller.signal})
    if(response.ok){
      clearTimeout(fetchAbort);
      const result = await response.json();
      return result;
    }
}catch (err){
  console.log("api faced an error ");
}
};


 export function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
      
     

    };

   
    return array;
  };

  