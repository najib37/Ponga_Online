# PONGA ONLINE
This is a realtime multiplayer pong game created using the following technologies:
- backend:
	- **NestJS**
	- **PrismaORM**
	- **Socket.io**
	- **Postgres**
- frontend:
	- **ReactJs**
	- **Tailwind css**
# setup

start
```
docker compose up 
```
stop and preserve the data
```
docker compose down --rmi local
```
stop and delet all the data
```
docker compose down --volumes --rmi local
```

**Client URL**: localhost:8080
**Api URL**: localhost:3000

!!! check the env_example to create your own .env file otherwise the project wont be builth

# Live Demo

143.198.2.149:8080

# Screenshots

![main](https://github.com/najib37/Ponga_Online/assets/120307266/ecad373c-66b4-4284-93c4-70696a7913ee)
