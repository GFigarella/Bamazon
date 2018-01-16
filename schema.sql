DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

/* Table Structure for bamazonDB */

CREATE TABLE items_for_sale (
  id INT NOT NULL AUTO_INCREMENT,
  item VARCHAR(255) NULL,
  department VARCHAR (255) NULL,
  price DECIMAL(10,2),
  quantity INT NULL,
  PRIMARY KEY (id)
);


INSERT INTO items_for_sale (item, department, price, quantity)
VALUES ("Coffe Mug", "home", 12.00, 50);

INSERT INTO items_for_sale (item, department, price, quantity)
VALUES ("Sony Headphones", "electronics", 165.00, 47);

INSERT INTO items_for_sale (item, department, price, quantity)
VALUES ("Couch", "home", 10.00, 3);

INSERT INTO items_for_sale (item, department, price, quantity)
VALUES ("Keyboard", "electronics", 87.99, 33);

INSERT INTO items_for_sale (item, department, price, quantity)
VALUES ("Beef Jerky", "food and drinks", 4.99, 25);

INSERT INTO items_for_sale (item, department, price, quantity)
VALUES ("Tamagotchi", "node_assignments", 1.99, 100);

INSERT INTO items_for_sale (item, department, price, quantity)
VALUES ("4k TV", "electronics", 999.99, 14);



