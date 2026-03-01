<template>
<form @submit.prevent="submitForm">
       <h1>formulaire personnel</h1>
  <div>
    <label>NOM:</label><br>
    <input type="text" v-model="nom"><br>
    <label>PRENOM:</label><br>
    <input type="text" id="prenom" v-model="prenom"><br>
    <label>AGE:</label><br>
    <input type="number" v-model="age"><br>
   <p v-if="age < 0" style="color:red;">l'âge ne doit pas être négatif.</p> 
    <label>CLASSE:</label><br>
    <input type="text" v-model="classe"><br><br>
    <button type="submit">Submit</button> <br><br>
  </div>
        <button @click="fetchData">Afficher les données</button> <br><br>
</form>  
     <div v-if="items.length > 0">
        <h2>Les donnee de la bd</h2>
          <ul>
              <li v-for="item in items" :key="item.id">
                  {{item.id}} {{ item.nom }} {{ item.prenom }} {{ item.age }} {{ item.classe }}
              </li>
          </ul>
     </div>
     <div>
      <button  @click="verifier">Modifier les données</button><br><br>
      <div v-if="isEditing">
        <label>ID:</label><br>
        <input type="number" v-model="idveri"><br>
         <button @click="newdata">Valider</button>
        <p v-if="reponse1== false" style="color:red;">
         l'id n'existe pas dans la base de données.</p>
          <p v-else-if="reponse1== true" style="color:green;">
          <p>Entrez les nouvelles donneés</p>
            <label>ID:</label><br>
            <input type="number" v-model="idveri"><br>
            <label>NOM:</label><br>
            <input type="text" v-model="nom"><br>
            <label>PRENOM:</label><br>
            <input type="text" id="prenom" v-model="prenom"><br>
            <label>AGE:</label><br>
            <input type="number" v-model="age"><br>
            <p v-if="age < 0" style="color:red;">l'âge ne doit pas être négatif.</p> 
            <label>CLASSE:</label><br>
            <input type="text" v-model="classe"><br><br>
            <button @click="updateData">Modifier</button>
        </p>
      
      </div>
     </div>
     <div>
     </div>
      <button @click="supprimer">Supprimer</button>
      <div v-if="isEdit">
        <label>ID:</label>
        <input type="number" v-model="idveri2"><br>
         <button @click="valider2">Valider</button>
        <p v-if="reponse2== false" style="color:red;">
         l'id n'existe pas dans la base de données.</p>
          <p v-else-if="reponse2== true" style="color:green;">
          l'id existe dans la base de données.
             <p v-if="veri1==0">

             </p>
        </p>
      </div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
const nom = ref('')
const prenom = ref('')
const age = ref(0)
const classe = ref('')
const items = ref([])
const isEditing = ref(false)
const isEdit = ref(false)
const reponse1 = ref(0)
const reponse2 = ref(0)
const idveri = ref(0)
const idveri2 = ref(0)
const veri1=ref(0)
//function for submit form
async function submitForm() {
  const user = {
    nom: nom.value,
    prenom: prenom.value,
    age: age.value,
    classe: classe.value
  }
  try{
    const res=await fetch('http://localhost:3002/submit',{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify(user)
    })
  }
  catch(error){
    console.error('Error:',error)
  }
  //reset form
  nom.value=''
  prenom.value=''
  age.value=0
  classe.value=''
}
//function for get data from bd
async function fetchData(){
  try{
    const res=await fetch('http://localhost:3002/data')
    const data=await res.json()
    items.value=data
  }
  catch(error){
    console.error('Error:',error)
  }
}
//function for verify if button is clicked
async function verifier(){
  isEditing.value=true
}
//function for verifie if button supprimer is clicked
async function supprimer(){
  isEdit.value=true
}
//function for validate id
  async function  newdata(){
    //call function get
    await fetchData()
    //verify if id exist in bd
    const verite= items.value.some(item => item.id === idveri.value);
    if(verite==true){
      reponse1.value=true
    }
    else{
      reponse1.value=false
    }
  }
  //function for send data eddite
  async function updateData(){
    const user = {
      id:idveri.value,
      nom: nom.value,
      prenom: prenom.value,
      age: age.value,
      classe: classe.value
    }
    try{
      const res=await fetch('http://localhost:3002/update',{
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(user)
      })
    }
    catch(error){
      console.error('Error:',error)
    }
    //reset form
    idveri.value=0
    nom.value=''
    prenom.value=''
    age.value=0
    classe.value=''
  }
  //function for verifie if id existe in bd
    async function valider2(){
    //call function get
    await fetchData()
    //verify if id exist in bd
    const verite= items.value.some(item => item.id === idveri2.value);
    if(verite==true){
      reponse2.value=true
      veri1.value=0
      try{
        const res=await fetch(`http://localhost:3002/delete/${idveri2.value}`,{
          method:'DELETE',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({id:idveri2.value})
        })
        //call data deleted
        const data=await res.json()
        console.log('Data deleted:', data)
        //recuperer data after delete
        await fetchData()
      }
      catch(error){
        console.error('Error:',error)
      }
    }
    else{
      reponse2.value=false
      
    }
    //send for delete

  }
</script>