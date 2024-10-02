import Client from "./client";


export const login = async (username: string, password: string) => {
    try {
      const response = await Client.post(
        `/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
      );
      //　ここにログイン後の処理を追加

      
    } catch (error) {
      console.error(error);
      // 必要に応じてエラーハンドリングを追加
    }
  };