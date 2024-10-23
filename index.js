const http = require('http');
const path = require('path');
const fs = require('fs');
const hostname = '127.0.0.1';
const port = 3000;
const dataFile = 'site/data/texts.json';
const userFile = 'site/data/users.json';

const server = http.createServer((request, response) => {
	if (request.method === 'GET') {
		let filePath = 'site/';

		switch(request.url) {
			case '/':
				filePath += 'frontPage/index.html';
				site = 'frontPage';
				break;
			case '/script.js':
				filePath += 'frontPage/script.js';
				break;
			case '/style.css':
				filePath += 'frontPage/style.css';
				break;
			default:
				filePath += request.url;
		}

		const extname = path.extname(filePath);
		let contentType = 'text/html';

		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.json':
				contentType = 'application/json';
				break;
			case '.png':
				contentType = 'image/png';
				break;
			case '.jpg':
				contentType = 'image/jpg';
				break;
			case '.txt':
				contentType = 'text/plain';
				break;
		}

		fs.readFile(filePath, (error, content) => {
			if (!error) {
				response.setHeader('Content-Type', contentType);
				response.end(content, 'utf-8');
			}
			else {
				if (error.code == 'ENOENT') {
					fs.readFile("errorSites/404Error.html", 'utf-8', (error, data) => {
						if (error) {
							throw error;
						} else {
							response.setHeader('Content-Type', 'text/html');
							response.statusCode = 404;
							response.end(data);
						}
					});
				}
				else {
					fs.readFile("errorSites/500Error.html", 'utf-8', (error, data) => {
						if (error) {
							throw error;
						} else {
							response.setHeader('Content-Type', 'text/html');
							response.statusCode = 500;
							response.end(data);
						}
					});
				}
			}
		});
	}
	else if (request.method === 'POST') {
		let chunk = '';
		request.on('data', (data) => {
			chunk += data;
		});
		request.on('end', (data) => {
			let chunkData = JSON.parse(chunk);
			if (chunkData[0] == 'clear') {
				fs.writeFile(dataFile, '[]', (error) => {
					if (error) {
						throw error;
					}
				});
				response.end();
			}
			else if (chunkData.type == 'login') {
				let newData = {
					user: chunkData.user,
					password: chunkData.password
				};

				fs.readFile(userFile, (error, rData) => {
					if (error) {
						throw error;
					}
					else {
						let pData = JSON.parse(rData);
						let isUser = false;

						for (let i = 0; i < pData.length; i++) {
							if (pData[i].user == newData.user && pData[i].password == newData.password) {
								fs.writeFile(
									userFile, 
									JSON.stringify(pData), (error) => {
										if (error) {
											throw error;
										}
									}
								);
								isUser = true;
								break;
							}
						}

						if (isUser) {
							response.setHeader('Content-Type', 'text/plain');
							response.statusCode = 200;
							response.end('Login Success');
						}
						else {
							response.setHeader('Content-Type', 'text/plain');
							response.statusCode = 202;
							response.end('Login Failed');
						}
					}
				})
			}
			else if (chunkData.type == 'signup') {
				let newData = {
					user: chunkData.user,
					email: chunkData.email,
					password: chunkData.password
				};
				fs.readFile(userFile, (error, rData) => {
					if (error) {
						response.setHeader('Content-Type', 'text/plain');
						response.statusCode = 202;
						response.end('Signup Failed');
					}
					else {
						let pData = JSON.parse(rData);
						pData.push(newData);
						fs.writeFile(userFile, JSON.stringify(pData), (error) => {
							if (error) {
								response.setHeader('Content-Type', 'text/plain');
								response.statusCode = 202;
								response.end('Signup Failed');
							}
							else {
								response.setHeader('Content-Type', 'text/plain');
								response.statusCode = 200;
								response.end('Signup Success');
							}
						});
					}
				})
			}
			else if (chunkData.type == 'send') {
				fs.readFile(dataFile, (error, rData) => {
					if (!error) {
						let pData = JSON.parse(rData);

						let newData = {
							user: chunkData.user,
							text: chunkData.text,
							time: new Date()
						};

						pData.push(newData);

						fs.writeFile(dataFile, JSON.stringify(pData), (error) => {
							if (error) {
								throw error;
							}
						})
					}
					else {
						throw error;
					}
				});
				response.end();
			}
		});
	}
});

server.listen(port, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
