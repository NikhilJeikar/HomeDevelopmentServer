import Cookies from "universal-cookie";

export const SetCookies = (username, session_id) => {
  const cookies = new Cookies();
  cookies.set("username", username);
  cookies.set("session_id", session_id);
};

export const readCookies = () => {
    const cookies = new Cookies()
    const username = cookies.get('username')
    const session_id = cookies.get('session_id')
  
    return {
        username,
        session_id
    }
  }