# ITE501 Starter API (Node.js/Express) — Student/Employee Management

This is a **ready-made REST API** for ITE501 projects. Students should:
1) Download this project, **push to their own GitHub repo**,  
2) Make minor changes (config, small endpoint change, etc.),  
3) Deploy on AWS (EC2 + ALB + ASG) and automate via CI/CD.

## Features
- CRUD for **Students** and **Employees**
- Simple **API-key authentication** via header `x-api-key`
- JSON file persistence (no database required)

## Quick Start (Local)
```bash
npm install
cp .env.example .env
npm start
```

API will run at: `http://localhost:3000`

## Authentication
Include header:
- `x-api-key: <your API key>`

Default key in `.env.example` is `changeme-ite501`.

## Endpoints
### Health
- `GET /health`

### Students
- `GET /api/students`
- `GET /api/students/:id`
- `POST /api/students`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`

### Employees
- `GET /api/employees`
- `GET /api/employees/:id`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

## Sample Requests
```bash
curl -H "x-api-key: changeme-ite501" http://localhost:3000/api/students
```

Create a student:
```bash
curl -X POST http://localhost:3000/api/students \
  -H "Content-Type: application/json" \
  -H "x-api-key: changeme-ite501" \
  -d '{"name":"Aisha","email":"aisha@adu.ac.ae","major":"Cloud Computing"}'
```

## Notes for AWS Deployment
- Use **systemd** or **pm2** (optional) to keep the API running on EC2.
- Configure **ALB target group health check** to `/health`.
- Keep `API_KEY` as an environment variable (do NOT hardcode).

## License
Educational use for ITE501.
