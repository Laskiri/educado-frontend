## Setting up and running the content creator web application (frontend)

1. Clone **educado-frontend** repository from Github
2. Add .env file in the **app** folder with the following values:
   - VITE_CERT_URL
   - VITE_BACKEND_URL
3. Navigate to **app** folder: `cd app`
4. Run in terminal: `npm install`
5. Run in terminal: `npm run dev`
6. Open link from terminal to visit the page

Requires that the backend and certificate services are running. Check their respective guides to run them.
If run successfully you will be met by the login screen when you open the page:
![image](https://github.com/Educado-App/resources/assets/65400638/66636a5c-1eea-43d0-9b22-20669741c2a6)

Create a new user by clicking the *Cadastre-se agora* button and fill out the required information. If you can't be bothered to use use your own mail then use a temporary mail. After logging in, you will be redirected to the courses page, which can be seen below. Note that the page looks different if there aren't any courses in the database.
![image](https://github.com/Educado-App/resources/assets/65400638/ef965ec7-74ac-4595-be77-e1ad6d582ace)
