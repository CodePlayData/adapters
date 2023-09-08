FROM fauna/faunadb:4.27.0
EXPOSE 8443 8084

RUN mkdir -p /var/lib/faunadb /var/log/faunadb

VOLUME ["/var/lib/faunadb"]
VOLUME ["/var/log/faunadb"]

CMD ["faunadb"]
