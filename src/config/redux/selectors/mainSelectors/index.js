// export const getUsername = (state) => {
//     return state.login.username;
//   };
  
//   export const getPassword = (state) => {
//     return state.login.password;
//   };
  
  export const loginValid = (state) => {
    return state.main.user.username === 'Password';
  };
  