drop table `grocery_cart`;
drop table `cart`;
drop table `user_address`;
drop table `grocery_order`;
drop table `grocery_tag`;
drop table `tag`;
drop table `order`;
drop table `address`;
DROP table `grocery_picture`;
DROP table `grocery_shopping_list`;
DROP table `shopping_list`;
DROP table `grocery`;
drop table `category`;
DROP table `message`;
DROP table `user`;

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  `parent_category` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category_category` (`parent_category`),
  CONSTRAINT `fk_category_category` FOREIGN KEY (`parent_category`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `grocery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(30) NOT NULL,
  `description` text DEFAULT NULL,
  `price` numeric(8,2) NOT NULL,
  `category` int(11) DEFAULT NULL,
  `calories` numeric(8,2) DEFAULT NULL,
  `carbohydrates` numeric(8,2) DEFAULT NULL,
  `proteins` numeric(8,2) DEFAULT NULL,
  `fats` numeric(8,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_grocery_category` (`category`),
  CONSTRAINT `fk_grocery_category` FOREIGN KEY (`category`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `grocery_tag` (
  `grocery` int(11) NOT NULL,
  `tag` int(11) NOT NULL,
  PRIMARY KEY (`grocery`,`tag`),
  KEY `fk_grocery_tag_grocery` (`grocery`),
  CONSTRAINT `fk_grocery_tag_grocery` FOREIGN KEY (`grocery`) REFERENCES `grocery` (`id`),
  KEY `fk_grocery_tag_tag` (`tag`),
  CONSTRAINT `fk_grocery_tag_tag` FOREIGN KEY (`tag`) REFERENCES `tag` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `grocery_picture` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `grocery` int(11) NOT NULL,
  `path` varchar(80) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_grocery_picture_grocery` (`grocery`),
  CONSTRAINT `fk_grocery_picture_grocery` FOREIGN KEY (`grocery`) REFERENCES `grocery` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(30) unique NOT NULL,
  `name` varchar(80) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zip_code` varchar(30) NOT NULL,
  `address` varchar(80) NOT NULL,
  `city` varchar(80) NOT NULL,
  `state` varchar(80) NOT NULL,
  `country` varchar(80) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_address` (
  `user` int(11) NOT NULL,
  `address` int(11) NOT NULL,
  PRIMARY KEY (`user`,`address`),
  KEY `fk_user_address_user` (`user`),
  CONSTRAINT `fk_user_address_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  KEY `fk_user_address_address` (`address`),
  CONSTRAINT `fk_user_address_address` FOREIGN KEY (`address`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `order_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `address` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`),
  KEY `fk_order_address` (`address`),
  CONSTRAINT `fk_order_address` FOREIGN KEY (`address`) REFERENCES `address` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `grocery_order` (
  `order` int(11) NOT NULL,
  `grocery` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` numeric(8,2) NOT NULL,
  PRIMARY KEY (`grocery`,`order`),
  KEY `fk_grocery_order_grocery` (grocery),
  CONSTRAINT `fk_grocery_order_grocery` FOREIGN KEY (`grocery`) REFERENCES `grocery` (`id`),
  KEY `fk_grocery_order_order` (`order`),
  CONSTRAINT `fk_grocery_order_order` FOREIGN KEY (`order`) REFERENCES `order` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cart_user` (`user`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `grocery_cart` (
  `cart` int(11) NOT NULL,
  `grocery` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`grocery`,`cart`),
  KEY `fk_grocery_cart_grocery` (grocery),
  CONSTRAINT `fk_grocery_cart_grocery` FOREIGN KEY (`grocery`) REFERENCES `grocery` (`id`),
  KEY `fk_grocery_cart_cart` (`cart`),
  CONSTRAINT `fk_grocery_cart_cart` FOREIGN KEY (`cart`) REFERENCES `cart` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `shopping_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` int(11) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_shopping_list_user` (`user`),
  CONSTRAINT `fk_shopping_list_user` FOREIGN KEY (`user`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `grocery_shopping_list` (
  `shopping_list` int(11) NOT NULL,
  `grocery` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`grocery`,`shopping_list`),
  KEY `fk_grocery_shopping_list_grocery` (grocery),
  CONSTRAINT `fk_grocery_shopping_list_grocery` FOREIGN KEY (`grocery`) REFERENCES `grocery` (`id`),
  KEY `fk_grocery_shopping_list_order` (`shopping_list`),
  CONSTRAINT `fk_grocery_shopping_list_shopping_list` FOREIGN KEY (`shopping_list`) REFERENCES `shopping_list` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from` int(11) NOT NULL,
  `to` int(11) NOT NULL,
  `text` text NOT NULL,
  `datetime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pk_message` (`id`),
  CONSTRAINT `fk_message_from` FOREIGN KEY (`from`) REFERENCES `user` (`id`),
  CONSTRAINT `fk_message_to` FOREIGN KEY (`to`) REFERENCES `user` (`id`)
);



CREATE VIEW category_tree AS 
	WITH RECURSIVE category_tree AS (
	    SELECT c.id,
	        c.name,
	        c.parent_category,
	        CAST(c.id as varchar(50)) as children,
	        CAST('' as varchar(50)) as category_sequence
	    FROM category c left join category c2 on c2.parent_category=c.id
	    WHERE c2.id IS NULL group by c.id
	 
	UNION ALL
	 
	    SELECT parent.id,
	        parent.name,
	        parent.parent_category, 
	        parent.category_sequence as children,
	        concat(g.category_sequence, if(g.category_sequence='','',','),parent.category_sequence)
	    FROM (SELECT c.id,
	        c.name,
	        c.parent_category,
	        concat(c.id, ',',group_concat(distinct c2.id)) as category_sequence
	    FROM category c left join category c2 on c2.parent_category=c.id
	    group by c.id) parent
	    JOIN category_tree g
	      ON g.parent_category = parent.id 
	)
	 
	SELECT distinct *
	FROM category_tree
;

CREATE VIEW category_name_tree AS 
	WITH RECURSIVE category_name_tree AS (
	    SELECT id,
	        name,
	        parent_category,
	        CAST(name as VARCHAR(50)) AS category_sequence
	    FROM category c
	    WHERE parent_category IS NULL
	 
	UNION ALL
	 
	    SELECT parent.id,
	        parent.name,
	        parent.parent_category,
	        concat(category_sequence, ', ', parent.name) AS category_sequence
	    FROM category parent
	    JOIN category_name_tree g
	      ON g.id = parent.parent_category 
	)
	 
	SELECT id, name,
	     category_sequence
	FROM category_name_tree
;