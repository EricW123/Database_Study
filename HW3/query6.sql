-- get countries which customers here would buy more expensive tracks.


SELECT Country, count(CustomerId)
FROM customers
GROUP BY Country;

