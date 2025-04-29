# YumGo: Food Delivery Microservices System

A scalable, containerized food delivery platform built with a modern microservices architecture.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-v18+-green.svg)
![Docker](https://img.shields.io/badge/docker-compatible-blue.svg)
![Kubernetes](https://img.shields.io/badge/kubernetes-ready-brightgreen.svg)

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Services](#services)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Environment Setup](#environment-setup)
  - [Docker Deployment](#docker-deployment)
  - [Kubernetes Deployment](#kubernetes-deployment)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Contributing](#contributing)
- [License](#license)

## Overview

This project implements a comprehensive food delivery system with separate microservices handling distinct business domains. The application supports multiple user roles (customers, restaurants, delivery personnel) with role-based access control, real-time order tracking, payment processing, and automated notifications.

## Architecture

The system follows a microservices architecture pattern with the following key components:

- **API Gateway**: Single entry point that routes requests to appropriate services
- **Service Discovery**: Services register themselves and discover others dynamically
- **Containerization**: Docker containers for consistent development and deployment
- **Orchestration**: Kubernetes for scalable, resilient service management
- **Data Persistence**: MongoDB for document storage with service-specific databases
- **Authentication**: JWT-based authentication with role-based permissions

## Services

| Service                | Port | Description                                                |
| ---------------------- | ---- | ---------------------------------------------------------- |
| `api-gateway`          | 8080 | Routes client requests to appropriate services             |
| `user-management`      | 4000 | Handles user authentication, profiles, and role management |
| `restaurant-service`   | 4001 | Manages restaurant profiles, menus, and availability       |
| `order-service`        | 4002 | Processes order creation, tracking, and status updates     |
| `delivery-service`     | 4003 | Assigns and tracks delivery personnel                      |
| `payment-service`      | 4004 | Integrates with PayHere for payment processing             |
| `notification-service` | 4005 | Sends email/SMS notifications to all parties               |
| `frontend`             | 3000 | React web client with role-specific interfaces             |

## Technology Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React, Redux, Material-UI, Tailwind CSS
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **API Documentation**: Swagger
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **External Services**: PayHere (payments), Cloudinary (media), Twilio (SMS)

## Prerequisites

Before running the application, ensure you have the following installed:

- Docker & Docker Compose
- Kubernetes (Minikube or Docker Desktop with K8s enabled)
- Node.js (v18 or later)
- MongoDB (local or cloud service)
- Postman (for API testing)
- PayHere sandbox account (for payment testing)

## Getting Started

### Project Structure

```
project-root/
│
├── api-gateway/
├── user-management/
├── restaurant-service/
├── order-service/
├── delivery-service/
├── payment-service/
├── notification-service/
├── frontend/
```

### Environment Setup

1. Clone the repository

```bash
git clone https://github.com/Y3S2-DevSquad-Team/DS-Project/
cd food-delivery-microservices
```

2. Create `.env` files for each service based on the templates below:

**Example for user-management/.env:**

```
PORT=4000
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_JWT_SECRET=your_refresh_secret
MONGODB_URI=mongodb://mongo:27017/user-db
CLOUDINARY_URL=your_cloudinary_url
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

Repeat for other services with appropriate environment variables.

### Docker Deployment

1. Build and run all services using Docker Compose:

```bash
docker-compose up --build
```

2. For individual service deployment:

```bash
# Build specific service image
docker build -t user-management ./user-management

# Run container
docker run -p 4000:4000 --env-file ./user-management/.env user-management
```

3. Access the frontend at `http://localhost:3000`

### Kubernetes Deployment

1. Start your Kubernetes cluster:

```bash
minikube start
```

2. Create ConfigMaps for environment variables:

```bash
kubectl create configmap app-config --from-env-file=.env
```

3. Deploy MongoDB:

```bash
kubectl apply -f kubernetes/mongo-pvc.yaml
kubectl apply -f kubernetes/mongo-deployment.yaml
kubectl apply -f kubernetes/mongo-service.yaml
```

4. Deploy microservices:

```bash
# Apply all configurations at once
kubectl apply -f kubernetes/

# Or deploy services individually
kubectl apply -f kubernetes/user-management-deployment.yaml
kubectl apply -f kubernetes/user-management-service.yaml

# Repeat for other services
```

5. Expose the frontend:

```bash
kubectl expose deployment frontend --type=LoadBalancer --name=frontend-service
minikube service frontend-service
```

6. Get the IP address for frontend access:

```bash
minikube service frontend-service --url
```


## Testing

Run tests for all services:

```bash
# From project root
npm run test-all

# For individual services
cd order-service
npm test
```

## Monitoring

Service health and metrics can be monitored via:

1. Kubernetes Dashboard:

```bash
minikube dashboard
```

2. Service logs:

```bash
kubectl logs -f deployment/user-management
```


##  Authors

* Yasiru Kaveeshwara
* Vilan Siriwardana
* Shaini Gunawikrama
* Yasasi Kariyawasam
