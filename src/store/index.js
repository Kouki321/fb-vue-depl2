import { createStore } from 'vuex'
///import { getAuth } from "firebase/auth";
import { db } from "../firebase/firebaseInit";
import { collection, doc,getDocs,getDoc, query, orderBy ,deleteDoc,updateDoc} from "firebase/firestore";

export default createStore({
  state: { sampleBlogCards: [
      { blogTitle: "Blog Card #1", blogCoverPhoto: "stock-1", blogDate: "May 1, 2021" },
      { blogTitle: "Blog Card #2", blogCoverPhoto: "stock-2", blogDate: "May 1, 2021" },
      { blogTitle: "Blog Card #3", blogCoverPhoto: "stock-3", blogDate: "May 1, 2021" },
      { blogTitle: "Blog Card #4", blogCoverPhoto: "stock-4", blogDate: "May 1, 2021" },
      ],
      editPost: false,
      

      blogPosts:[],
      postLoaded:null,
      blogTitle:"",
      blogHTML:"Write your blog title here",
      blogPhotoName:"",
      blogPhotoFileURL:null,
      blogPhotoPreview:null,
      editpost: null,
      user: null, 
      profileAdmin:null,
      profileEmail: null, 
      profileFirstName: null,
      profileLastName: null,
      profileUsername: null,
      profileId: null,
      profileInitials: null,
      profileActive:null,
  },  
  getters:{
    blogPosts(state){
      return state.blogPosts ;

    },
    blogPostsFeed(state){
      return state.blogPosts.slice(0,2);
    },
    blogPostscards(state){
      return state.blogPosts.slice(2,6);
    },

  },
  mutations: {
    openPhotoPreview(state){
      state.blogPhotoPreview=!state.blogPhotoPreview;
    },
    fileNameChange(state, payload) {
      state.blogPhotoName = payload;
    },
    createFileURL(state, payload) {
      state.blogPhotoFileURL = payload;
    },
    newBlogPost(state, payload) {
      state.blogHTML = payload;
      console.log(state.blogHTML); // Ensure you see this log in the console
     },
    updateBlogTitle(state, payload) {
      state.blogTitle = payload;
      console.log(state.blogTitle); // Ensure you see this log in the console
      console.log("state.blogTitle"); // Ensure you see this log in the console

    },
    changeFirstName(state,payload){
      state.profileFirstName =payload;
    },
    filterBlogPost(state,payload){
      state.blogPosts =state.blogPosts.filter((p)=>p.blogID !== payload);
    },
    changeLastName(state,payload){
      state.profileLastName =payload;
    },
    changeUsername(state,payload){
      state.profileUsername =payload;
    },setProfileAdmin(state, isAdmin) {
      state.profileAdmin = isAdmin;
     }, 
    toggleEditPost(state, payload) {
      state.editPost = payload;
     },
    updateUser(state,payload){
      state.user=payload;

    } ,
    setProfileEmail(state, email) {
      state.profileEmail = email;
    },
    setProfileActive(state, active) {
      state.profileActive = active;
    },
    setBlogState(state, { title, html, fileURL, photoName }) {
      state.blogTitle = title;
      state.blogHTML = html;
      state.blogPhotoFileURL = fileURL;
      state.blogPhotoName = photoName;
    },
    setProfileInfo(state,doc){
      state.profileId = doc.id;
      state.profileEmail=doc.data().email;
      state.profileFirstName=doc.data().firstName;
      state.profileLastName=doc.data().lastName      ;
      state.profileUsername=doc.data().userName;
      state.profileAdmin=doc.data().admin;
      state.profileActive=doc.data().active;
      
     },
    setProfileInitials (state) { 
    state.profileInitials = 
    state.profileFirstName.match(/(\b\S)?/g).join("") +
    state.profileLastName.match(/(\b\S)?/g).join(""); 
  },
  }, 
  actions: { 
    async updateUserSettings({ commit, state }) {
      try {
        const dataBase = doc(collection(db, "users"), state.profileId);
        await updateDoc(dataBase, {
          firstName: state.profileFirstName,
          lastName: state.profileLastName,
          userName: state.profileUsername,
        });
        commit("setProfileInitials");
      } catch (error) {
        console.error("Error updating user settings:", error);
      }
    },
    async updatePost ({commit,dispatch},payload){
      commit("filterBlogPost",payload);
      await dispatch("getPost")
    },
    async getPost({ state }) {
      try {
         const dataBase = collection(db, "blogPosts");
         const querySnapshot = await getDocs(dataBase);
         state.blogPosts = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
           if (!state.blogPosts.some(post => post.blogID === doc.id)) {
            const blogPost = {
              blogID: doc.id,
              blogHTML: data.blogHTML,
              blogCoverPhoto: data.blogCoverPhoto,
              blogTitle: data.blogTitle,
              blogDate: data.date,
              blogPhotoName: data.blogPhotoName,
             };
            state.blogPosts.push(blogPost);
          }
        });
        
        state.postLoaded = true;
      } catch (error) {
        console.error("Error fetching posts: ", error);
        state.postLoaded = false;
      }

     },
     async getCurrentser({ commit }, user) {
      try {
        if (user) {
          const userId = user.uid;
          const dataBase = doc(collection(db, "users"), userId);
          const docSnap = await getDoc(dataBase);

          if (docSnap.exists()) {
            commit("setProfileInfo", docSnap);
            commit("setProfileInitials");
          } else {
            console.error("No such document!");
          }
        } else {
          console.log("No user is signed in");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    },
    async getCurrentUser({ commit },user) {
      try {
          if (user) {
          const userId = user.uid;
          const dataBase = doc(collection(db, "users"), userId);

          const q = query(dataBase, orderBy("date", "desc"));

          const dbResults = await getDocs(q);
    
          if (dbResults.exists()) {
            const userData = dbResults.data(); // Fetch the document data
            commit("setProfileInfo", dbResults);
            commit("setProfileInitials");
    
            // Extract data from the document
            const {  email, firstName, lastName, userName, active } = userData;
    
            commit("setProfileEmail", email); // Set the email
            commit("changeFirstName", firstName); // Set the first name
            commit("changeLastName", lastName); // Set the last name
            commit("changeUsername", userName); // Set the username
            commit("setProfileActive", active); // Set the active status
    
            // Fetch token and additional claims if needed
            const token = await user.getIdTokenResult();
            const admin = token.claims.admin; // Custom claim (if used)
            console.log('Admin claim from token:', admin);
            commit("setProfileAdmin", admin); // Set the email
            console.log('Firestore data:', userData);
    
          } else {
            console.error("No such document!");
          }
        } else {
          console.log("No user is signed in");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
      console.log(this.state.blogPosts);
    }
,    
async deletePost({ commit }, payload) {
  const getPost = doc(collection(db, "blogPosts"), payload);
  try {
    await deleteDoc(getPost);
    console.log("Document successfully deleted!");
    commit("filterBlogPost", payload);
  } catch (error) {
    console.error("Error removing document: ", error);
  }
}},
  modules: {
  }
}) 