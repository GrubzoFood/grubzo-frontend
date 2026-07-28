run:
	@echo "Starting frontend..."
	@cd frontend && npm run dev > ../tmp/frontend.log 2>&1 &
	@echo "Frontend started (logs in tmp/frontend.log)"

docker-build:
	docker build -t rohana001/grubzo-frontend:v0.1.1 .
docker-push:
	docker push rohana001/grubzo-frontend:v0.1.1
