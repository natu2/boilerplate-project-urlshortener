# URL Shortener Microservice

This is a URL Shortener Microservice project. This project utilizes HTML, JavaScript and MongoDB Atlas to allow users to obtain shortened versions of a given url. 

![image](https://github.com/user-attachments/assets/07034581-caa0-40be-971d-b94f8ef5f8f6)

![image](https://github.com/user-attachments/assets/16be830b-ebc1-4793-a3b9-400c3e4948da)

In this example, localhost:3000/api/short_url/0 redirects to disney.com


## Instal & Run 
1. Clone the repository to your local machine
2. Use the command 'npm run start' in your terminal.
3. When the microservice is running, you should see 'your app is listening on port ____' appear in your terminal. Navigate to the given port in your browser. (localhost:[the port number])
##### 4. To get a shortened url, type in a valid url in the text box and click 'POST URL.'
5. The response will contain a JSON object with the key 'short_url' and a corresponding numerical value. 
6. Your new shortened url will be localhost:[port number]/api/shorturl/[value of key 'short_url']
7. This new shortened url will redirect you to the site of the original url.
