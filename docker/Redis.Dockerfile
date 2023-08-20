FROM redis:latest
EXPOSE 6379 8001

CMD ["redis-server"]
