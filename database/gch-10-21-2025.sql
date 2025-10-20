-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: gch
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activitylogs`
--

DROP TABLE IF EXISTS `activitylogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` varchar(45) DEFAULT NULL,
  `description` longtext,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=447 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylogs`
--

LOCK TABLES `activitylogs` WRITE;
/*!40000 ALTER TABLE `activitylogs` DISABLE KEYS */;
INSERT INTO `activitylogs` VALUES (1,'1','User logged out: Left4code (midone@left4code.com)','2025-09-20 23:55:07','2025-09-20 23:55:07',NULL),(2,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-20 23:55:18','2025-09-20 23:55:18',NULL),(3,'1','User logged out: Left4code (midone@left4code.com)','2025-09-20 23:55:38','2025-09-20 23:55:38',NULL),(4,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-20 23:55:44','2025-09-20 23:55:44',NULL),(5,'1','User logged out: Left4code (midone@left4code.com)','2025-09-21 00:07:14','2025-09-21 00:07:14',NULL),(6,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-21 00:19:45','2025-09-21 00:19:45',NULL),(7,'1','User logged out: Left4code (midone@left4code.com)','2025-09-21 00:20:08','2025-09-21 00:20:08',NULL),(8,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-21 00:21:06','2025-09-21 00:21:06',NULL),(9,'1','tbl_appointment was updated','2025-09-21 00:27:11','2025-09-21 00:27:11',NULL),(10,'1','Appointment status changed from \'pending\' to \'completed\' for tracking number: TRK000009','2025-09-21 00:27:11','2025-09-21 00:27:11',NULL),(11,'1','notification_settings was created','2025-09-21 01:09:54','2025-09-21 01:09:54',NULL),(12,'1','notification_settings was created','2025-09-21 01:12:27','2025-09-21 01:12:27',NULL),(13,'1','notification_settings was updated','2025-09-21 01:14:13','2025-09-21 01:14:13',NULL),(14,'1','notification_settings was updated','2025-09-21 01:14:20','2025-09-21 01:14:20',NULL),(15,'1','tbl_billing_management was updated','2025-09-21 01:26:53','2025-09-21 01:26:53',NULL),(16,'1','Payment submitted for Bill #000001 - Amount: ₱9.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:26:53','2025-09-21 01:26:53',NULL),(17,'1','tbl_billing_management was updated','2025-09-21 01:28:36','2025-09-21 01:28:36',NULL),(18,NULL,'Test activity log entry','2025-09-21 01:31:35','2025-09-21 01:31:35',NULL),(19,NULL,'Test activity log entry','2025-09-21 01:32:59','2025-09-21 01:32:59',NULL),(20,'1','tbl_billing_management was updated','2025-09-21 01:33:15','2025-09-21 01:33:15',NULL),(21,'1','Payment submitted for Bill #000001 - Amount: ₱9.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:33:15','2025-09-21 01:33:15',NULL),(22,'1','tbl_billing_management was created','2025-09-21 01:38:54','2025-09-21 01:38:54',NULL),(23,'1','tbl_billing_management was updated','2025-09-21 01:39:19','2025-09-21 01:39:19',NULL),(24,'1','Payment submitted for Bill #000001 - Amount: ₱72.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:39:19','2025-09-21 01:39:19',NULL),(25,'1','tbl_billing_management was created','2025-09-21 01:43:08','2025-09-21 01:43:08',NULL),(26,'1','tbl_billing_management was updated','2025-09-21 01:43:30','2025-09-21 01:43:30',NULL),(27,'1','Payment submitted for Bill #000001 - Amount: ₱65.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:43:30','2025-09-21 01:43:30',NULL),(28,'1','tbl_billing_management was updated','2025-09-21 01:46:12','2025-09-21 01:46:12',NULL),(29,'1','tbl_billing_management was updated','2025-09-21 01:46:29','2025-09-21 01:46:29',NULL),(30,'1','Payment submitted for Bill #000001 - Amount: ₱65.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:46:29','2025-09-21 01:46:29',NULL),(31,'1','tbl_billing_management was updated','2025-09-21 01:49:22','2025-09-21 01:49:22',NULL),(32,'1','tbl_billing_management was updated','2025-09-21 01:49:55','2025-09-21 01:49:55',NULL),(33,'1','Payment submitted for Bill #000001 - Amount: ₱65.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:49:55','2025-09-21 01:49:55',NULL),(34,'2','User logged in successfully: bobo (d@gmail.com)','2025-09-21 01:52:30','2025-09-21 01:52:30',NULL),(35,'1','tbl_billing_management was created','2025-09-21 01:53:20','2025-09-21 01:53:20',NULL),(36,'2','tbl_billing_management was updated','2025-09-21 01:53:42','2025-09-21 01:53:42',NULL),(37,'2','Payment submitted for Bill #000001 - Amount: ₱12.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:53:42','2025-09-21 01:53:42',NULL),(38,'1','tbl_billing_management was created','2025-09-21 01:58:18','2025-09-21 01:58:18',NULL),(39,'1','Created new billing for bobo - Amount: ₱10.00 - Bill #000001 - Status: sent to owners','2025-09-21 01:58:18','2025-09-21 01:58:18',NULL),(40,'2','tbl_billing_management was updated','2025-09-21 01:59:34','2025-09-21 01:59:34',NULL),(41,'2','Payment submitted for Bill #000001 - Amount: ₱10.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 01:59:34','2025-09-21 01:59:34',NULL),(42,'1','tbl_billing_management was updated','2025-09-21 02:04:41','2025-09-21 02:04:41',NULL),(43,'1','Rejected payment for bobo - Amount: ₱10.00 - Bill #000001 - Reason: vfdfvdfvdvdf','2025-09-21 02:04:41','2025-09-21 02:04:41',NULL),(44,'2','tbl_billing_management was updated','2025-09-21 02:05:13','2025-09-21 02:05:13',NULL),(45,'2','Payment submitted for Bill #000001 - Amount: ₱10.00 - Payment method: Main GCash - Status: Under Review','2025-09-21 02:05:13','2025-09-21 02:05:13',NULL),(46,'1','tbl_billing_management was updated','2025-09-21 02:05:30','2025-09-21 02:05:30',NULL),(47,'1','Approved payment for bobo - Amount: ₱10.00 - Bill #000001','2025-09-21 02:05:30','2025-09-21 02:05:30',NULL),(48,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-21 04:33:38','2025-09-21 04:33:38',NULL),(49,'1','permission_settings was created','2025-09-21 05:17:29','2025-09-21 05:17:29',NULL),(50,'1','permission_settings_list was created','2025-09-21 05:17:29','2025-09-21 05:17:29',NULL),(51,'1','permission_settings_list was created','2025-09-21 05:17:29','2025-09-21 05:17:29',NULL),(52,'1','permission_settings was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(53,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(54,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(55,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(56,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(57,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(58,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(59,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(60,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(61,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(62,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(63,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(64,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(65,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(66,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(67,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(68,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(69,'1','permission_settings_list was created','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(70,'1','permission_settings was deleted','2025-09-21 05:30:43','2025-09-21 05:30:43',NULL),(71,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(72,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(73,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(74,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(75,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(76,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(77,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(78,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(79,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(80,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(81,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(82,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(83,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(84,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(85,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(86,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(87,'1','permission_settings_list was created','2025-09-21 05:30:52','2025-09-21 05:30:52',NULL),(88,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(89,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(90,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(91,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(92,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(93,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(94,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(95,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(96,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(97,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(98,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(99,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(100,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(101,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(102,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(103,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(104,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(105,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(106,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(107,'1','permission_settings_list was created','2025-09-21 05:33:34','2025-09-21 05:33:34',NULL),(108,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-21 22:57:35','2025-09-21 22:57:35',NULL),(109,'1','User logged out: Left4code (midone@left4code.com)','2025-09-21 23:06:12','2025-09-21 23:06:12',NULL),(110,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-21 23:08:26','2025-09-21 23:08:26',NULL),(111,'1','system_settings was updated','2025-09-21 23:20:46','2025-09-21 23:20:46',NULL),(112,'1','system_settings was updated','2025-09-21 23:21:12','2025-09-21 23:21:12',NULL),(113,'1','system_settings was updated','2025-09-21 23:21:46','2025-09-21 23:21:46',NULL),(114,'1','system_settings was updated','2025-09-21 23:21:54','2025-09-21 23:21:54',NULL),(115,'1','system_settings was updated','2025-09-21 23:22:30','2025-09-21 23:22:30',NULL),(116,'1','User logged out: Left4code (midone@left4code.com)','2025-09-21 23:22:43','2025-09-21 23:22:43',NULL),(117,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-21 23:30:56','2025-09-21 23:30:56',NULL),(118,'1','system_settings was updated','2025-09-21 23:32:08','2025-09-21 23:32:08',NULL),(119,'1','system_settings was updated','2025-09-21 23:32:15','2025-09-21 23:32:15',NULL),(120,'1','User was updated','2025-09-21 23:35:18','2025-09-21 23:35:18',NULL),(121,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-22 11:57:30','2025-09-22 11:57:30',NULL),(122,'1','User was created','2025-09-22 11:58:20','2025-09-22 11:58:20',NULL),(123,'1','permission_settings was created','2025-09-22 12:07:40','2025-09-22 12:07:40',NULL),(124,'1','permission_settings_list was created','2025-09-22 12:07:40','2025-09-22 12:07:40',NULL),(125,'1','User logged out: Left4code (midone@left4code.com)','2025-09-22 12:07:46','2025-09-22 12:07:46',NULL),(126,'2','User logged in successfully: bobo (d@gmail.com)','2025-09-22 12:07:54','2025-09-22 12:07:54',NULL),(127,'2','User logged out: bobo (d@gmail.com)','2025-09-22 12:08:07','2025-09-22 12:08:07',NULL),(128,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-09-22 12:08:14','2025-09-22 12:08:14',NULL),(129,'1','tbl_billing_management was created','2025-09-22 12:10:55','2025-09-22 12:10:55',NULL),(130,'1','Created new billing for Left4code - Amount: ₱11.00 - Bill #000002 - Status: sent to owners','2025-09-22 12:10:55','2025-09-22 12:10:55',NULL),(131,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-10-11 08:19:38','2025-10-11 08:19:38',NULL),(132,'1','User logged out: Left4code (midone@left4code.com)','2025-10-11 08:58:39','2025-10-11 08:58:39',NULL),(133,'2','User logged in successfully: bobo (d@gmail.com)','2025-10-11 08:58:44','2025-10-11 08:58:44',NULL),(134,'2','User logged out: bobo (d@gmail.com)','2025-10-11 08:59:14','2025-10-11 08:59:14',NULL),(135,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-10-11 08:59:20','2025-10-11 08:59:20',NULL),(136,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(137,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(138,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(139,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(140,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(141,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(142,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(143,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(144,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(145,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(146,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(147,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(148,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(149,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(150,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(151,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(152,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(153,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(154,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(155,'1','permission_settings_list was created','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(156,'1','User logged out: Left4code (midone@left4code.com)','2025-10-11 09:00:36','2025-10-11 09:00:36',NULL),(157,NULL,'Failed login attempt for user: bobo (d@gmail.com)','2025-10-11 09:00:44','2025-10-11 09:00:44',NULL),(158,NULL,'Failed login attempt for user: bobo (d@gmail.com)','2025-10-11 09:00:47','2025-10-11 09:00:47',NULL),(159,NULL,'Failed login attempt for user: bobo (d@gmail.com)','2025-10-11 09:00:53','2025-10-11 09:00:53',NULL),(160,'2','User logged in successfully: bobo (d@gmail.com)','2025-10-11 09:00:55','2025-10-11 09:00:55',NULL),(161,'2','User logged out: bobo (d@gmail.com)','2025-10-11 09:24:37','2025-10-11 09:24:37',NULL),(162,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-10-11 09:24:42','2025-10-11 09:24:42',NULL),(163,'1','User logged out: Left4code (midone@left4code.com)','2025-10-11 09:32:46','2025-10-11 09:32:46',NULL),(164,NULL,'Failed login attempt for user: bobo (d@gmail.com)','2025-10-11 09:32:51','2025-10-11 09:32:51',NULL),(165,'2','User logged in successfully: bobo (d@gmail.com)','2025-10-11 09:32:53','2025-10-11 09:32:53',NULL),(166,'2','User logged out: bobo (d@gmail.com)','2025-10-11 09:35:29','2025-10-11 09:35:29',NULL),(167,'1','User logged in successfully: Left4code (midone@left4code.com)','2025-10-11 09:35:38','2025-10-11 09:35:38',NULL),(168,'1','User was updated','2025-10-11 11:13:47','2025-10-11 11:13:47',NULL),(169,'1','User was updated','2025-10-11 11:14:12','2025-10-11 11:14:12',NULL),(170,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-11 23:39:30','2025-10-11 23:39:30',NULL),(171,'1','notification_settings was created','2025-10-12 00:33:37','2025-10-12 00:33:37',NULL),(172,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 00:39:15','2025-10-12 00:39:15',NULL),(173,NULL,'Failed login attempt for user: bobo (d@gmail.com)','2025-10-12 00:39:21','2025-10-12 00:39:21',NULL),(174,'2','User logged in successfully: bobo (d@gmail.com)','2025-10-12 00:39:23','2025-10-12 00:39:23',NULL),(175,'2','User logged out: bobo (d@gmail.com)','2025-10-12 00:45:27','2025-10-12 00:45:27',NULL),(176,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 00:45:32','2025-10-12 00:45:32',NULL),(177,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 00:52:06','2025-10-12 00:52:06',NULL),(178,'2','User logged in successfully: bobo (d@gmail.com)','2025-10-12 00:52:12','2025-10-12 00:52:12',NULL),(179,'2','User logged out: bobo (d@gmail.com)','2025-10-12 00:52:37','2025-10-12 00:52:37',NULL),(180,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 00:52:42','2025-10-12 00:52:42',NULL),(181,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 00:58:00','2025-10-12 00:58:00',NULL),(182,'2','User logged in successfully: bobo (d@gmail.com)','2025-10-12 00:58:05','2025-10-12 00:58:05',NULL),(183,'2','User logged out: bobo (d@gmail.com)','2025-10-12 00:58:51','2025-10-12 00:58:51',NULL),(184,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 00:58:56','2025-10-12 00:58:56',NULL),(185,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 00:59:46','2025-10-12 00:59:46',NULL),(186,'2','User logged in successfully: bobo (d@gmail.com)','2025-10-12 00:59:51','2025-10-12 00:59:51',NULL),(187,'2','User logged out: bobo (d@gmail.com)','2025-10-12 01:00:13','2025-10-12 01:00:13',NULL),(188,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 01:00:18','2025-10-12 01:00:18',NULL),(189,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 01:10:34','2025-10-12 01:10:34',NULL),(190,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 01:11:39','2025-10-12 01:11:39',NULL),(191,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 01:16:09','2025-10-12 01:16:09',NULL),(192,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 01:19:22','2025-10-12 01:19:22',NULL),(193,'1','permission_settings was created','2025-10-12 02:59:38','2025-10-12 02:59:38',NULL),(194,'1','permission_settings_list was created','2025-10-12 02:59:38','2025-10-12 02:59:38',NULL),(195,'1','permission_settings was deleted','2025-10-12 03:01:30','2025-10-12 03:01:30',NULL),(196,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(197,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(198,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(199,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(200,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(201,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(202,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(203,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(204,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(205,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(206,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(207,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(208,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(209,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(210,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(211,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(212,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(213,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(214,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(215,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(216,'1','permission_settings_list was created','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(217,'1','User was updated','2025-10-12 03:02:23','2025-10-12 03:02:23',NULL),(218,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 03:07:46','2025-10-12 03:07:46',NULL),(219,NULL,'Failed login attempt for user: bfg (clzmiles@gmail.com)','2025-10-12 03:07:58','2025-10-12 03:07:58',NULL),(220,'3','User logged in successfully: bfg (clzmiles@gmail.com)','2025-10-12 03:08:13','2025-10-12 03:08:13',NULL),(221,'3','User logged out: bfg (clzmiles@gmail.com)','2025-10-12 03:08:38','2025-10-12 03:08:38',NULL),(222,'3','User was updated','2025-10-12 03:10:29','2025-10-12 03:10:29',NULL),(223,'3','User logged in successfully: bfg (clzmiles@gmail.com)','2025-10-12 03:10:29','2025-10-12 03:10:29',NULL),(224,'1','User was updated','2025-10-12 03:10:54','2025-10-12 03:10:54',NULL),(225,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 03:10:54','2025-10-12 03:10:54',NULL),(226,'3','User was updated','2025-10-12 03:11:13','2025-10-12 03:11:13',NULL),(227,'3','User logged out: bfg (clzmiles@gmail.com)','2025-10-12 03:11:13','2025-10-12 03:11:13',NULL),(228,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 03:11:31','2025-10-12 03:11:31',NULL),(229,'1','sticker_control_number was created','2025-10-12 04:22:36','2025-10-12 04:22:36',NULL),(230,'1','sticker_control_number was updated','2025-10-12 04:22:55','2025-10-12 04:22:55',NULL),(231,'1','sticker_control_number was created','2025-10-12 04:26:20','2025-10-12 04:26:20',NULL),(232,'1','sticker_control_number was updated','2025-10-12 04:26:26','2025-10-12 04:26:26',NULL),(233,'1','sticker_control_number was created','2025-10-12 04:33:38','2025-10-12 04:33:38',NULL),(234,'1','sticker_control_number was updated','2025-10-12 04:33:42','2025-10-12 04:33:42',NULL),(235,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 10:57:46','2025-10-12 10:57:46',NULL),(236,'1','User was updated','2025-10-12 11:00:26','2025-10-12 11:00:26',NULL),(237,'1','User logged out: aaaa (midone@left4code.com)','2025-10-12 11:00:26','2025-10-12 11:00:26',NULL),(238,'1','User was updated','2025-10-12 11:06:45','2025-10-12 11:06:45',NULL),(239,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-12 11:06:45','2025-10-12 11:06:45',NULL),(240,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-13 11:57:18','2025-10-13 11:57:18',NULL),(241,'1','User was updated','2025-10-13 12:20:22','2025-10-13 12:20:22',NULL),(242,'1','User logged out: aaaa (midone@left4code.com)','2025-10-13 12:20:22','2025-10-13 12:20:22',NULL),(243,NULL,'tbl_appointment was created','2025-10-13 12:22:13','2025-10-13 12:22:13',NULL),(244,'1','User was updated','2025-10-13 12:36:24','2025-10-13 12:36:24',NULL),(245,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-13 12:36:24','2025-10-13 12:36:24',NULL),(246,'1','User was updated','2025-10-13 12:41:41','2025-10-13 12:41:41',NULL),(247,'1','User logged out: aaaa (midone@left4code.com)','2025-10-13 12:41:41','2025-10-13 12:41:41',NULL),(248,NULL,'Failed login attempt for user: aaaa (midone@left4code.com)','2025-10-13 12:42:49','2025-10-13 12:42:49',NULL),(249,'1','User was updated','2025-10-13 12:42:51','2025-10-13 12:42:51',NULL),(250,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-13 12:42:51','2025-10-13 12:42:51',NULL),(251,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-16 11:27:34','2025-10-16 11:27:34',NULL),(252,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-16 12:07:13','2025-10-16 12:07:13',NULL),(253,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-17 11:41:28','2025-10-17 11:41:28',NULL),(254,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-18 00:23:58','2025-10-18 00:23:58',NULL),(255,'1','tbl_billing_management was updated','2025-10-18 00:52:14','2025-10-18 00:52:14',NULL),(256,'1','Payment submitted for Bill #000002 - Amount: ₱11.00 - Payment method: Main GCash - Status: Under Review','2025-10-18 00:52:14','2025-10-18 00:52:14',NULL),(257,'1','Approved landlord application for DENNIS L BONGAITAN - Property: VDVDFVDVFD - Unit: VDFVDFFVD','2025-10-18 00:58:30','2025-10-18 00:58:30',NULL),(258,'1','Declined landlord application for DENNIS L BONGAITAN - Property: VDVDFVDVFD - Unit: VDFVDFFVD - Reason: vfdvffvdfvdfdvdfv','2025-10-18 00:59:09','2025-10-18 00:59:09',NULL),(259,'1','User logged in successfully: aaaa (midone@left4code.com)','2025-10-18 05:28:53','2025-10-18 05:28:53',NULL),(260,'1','Approved landlord application for DENNIS L BONGAITAN - Property: VDVDFVDVFD - Unit: VDFVDFFVD - Business clearance uploaded','2025-10-18 06:08:44','2025-10-18 06:08:44',NULL),(261,'1','Tenant access enabled for landlord: DENNIS L BONGAITAN - Property: VDVDFVDVFD','2025-10-18 06:38:29','2025-10-18 06:38:29',NULL),(262,'1','Tenant access disabled for landlord: DENNIS L BONGAITAN - Property: VDVDFVDVFD','2025-10-18 06:38:58','2025-10-18 06:38:58',NULL),(263,'1','Tenant access enabled for landlord: DENNIS L BONGAITAN - Property: VDVDFVDVFD','2025-10-18 06:39:06','2025-10-18 06:39:06',NULL),(264,'1','Tenant access disabled for landlord: DENNIS L BONGAITAN - Property: VDVDFVDVFD','2025-10-18 06:43:15','2025-10-18 06:43:15',NULL),(265,'1','Tenant access enabled for landlord: DENNIS L BONGAITAN - Property: VDVDFVDVFD','2025-10-18 06:43:24','2025-10-18 06:43:24',NULL),(266,'1','User was updated','2025-10-18 08:17:41','2025-10-18 08:17:41',NULL),(267,'1','User logged out: aaaa (midone@left4code.com)','2025-10-18 08:17:41','2025-10-18 08:17:41',NULL),(268,'1','User was updated','2025-10-18 08:20:40','2025-10-18 08:20:40',NULL),(269,'1','User logged in successfully: aaaa (midone@left4code.com) from 127.0.0.1','2025-10-18 08:20:40','2025-10-18 08:20:40',NULL),(270,'1','User was updated','2025-10-18 08:21:53','2025-10-18 08:21:53',NULL),(271,'1','User logged out: aaaa (midone@left4code.com) from 127.0.0.1','2025-10-18 08:21:53','2025-10-18 08:21:53',NULL),(272,'1','User was updated','2025-10-18 08:22:12','2025-10-18 08:22:12',NULL),(273,'1','User logged in successfully: aaaa (midone@left4code.com) from 127.0.0.1','2025-10-18 08:22:12','2025-10-18 08:22:12',NULL),(274,'1','User was updated','2025-10-18 08:22:36','2025-10-18 08:22:36',NULL),(275,'1','User logged out: aaaa (midone@left4code.com) from 127.0.0.1','2025-10-18 08:22:37','2025-10-18 08:22:37',NULL),(276,'1','User was updated','2025-10-18 08:25:16','2025-10-18 08:25:16',NULL),(277,'1','User logged in successfully: aaaa (midone@left4code.com) from 210.1.107.2','2025-10-18 08:25:17','2025-10-18 08:25:17',NULL),(278,'1','User was updated','2025-10-18 08:32:57','2025-10-18 08:32:57',NULL),(279,'1','User logged out: aaaa (midone@left4code.com) from 127.0.0.1','2025-10-18 08:32:57','2025-10-18 08:32:57',NULL),(280,'1','User was updated','2025-10-18 08:33:26','2025-10-18 08:33:26',NULL),(281,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-18 08:33:26','2025-10-18 08:33:26',NULL),(282,'1','User was updated','2025-10-18 08:33:49','2025-10-18 08:33:49',NULL),(283,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 127.0.0.1','2025-10-18 08:33:49','2025-10-18 08:33:49',NULL),(284,'1','User was updated','2025-10-18 08:41:27','2025-10-18 08:41:27',NULL),(285,'1','User logged in successfully from new device: aaaa (dennisbongaitan18@gmail.com) - IP: 210.1.107.2, Location: Davao City, Davao Region, Philippines','2025-10-18 08:41:27','2025-10-18 08:41:27',NULL),(286,'1','User was updated','2025-10-18 08:42:08','2025-10-18 08:42:08',NULL),(287,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 127.0.0.1','2025-10-18 08:42:08','2025-10-18 08:42:08',NULL),(288,'1','User was updated','2025-10-18 08:44:44','2025-10-18 08:44:44',NULL),(289,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-18 08:44:45','2025-10-18 08:44:45',NULL),(290,'1','User was updated','2025-10-18 08:44:59','2025-10-18 08:44:59',NULL),(291,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-18 08:44:59','2025-10-18 08:44:59',NULL),(292,'1','User was updated','2025-10-18 09:05:08','2025-10-18 09:05:08',NULL),(293,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-18 09:05:09','2025-10-18 09:05:09',NULL),(294,'1','tbl_billing_management was created','2025-10-18 09:40:20','2025-10-18 09:40:20',NULL),(295,'1','Created new billing for bfg - Amount: ₱4.00 - Bill #000003 - Status: sent to owners','2025-10-18 09:40:20','2025-10-18 09:40:20',NULL),(296,'1','tbl_billing_management was updated','2025-10-18 09:41:40','2025-10-18 09:41:40',NULL),(297,'1','Updated billing for bobo - Amount: ₱10.00 - Bill #000001','2025-10-18 09:41:40','2025-10-18 09:41:40',NULL),(298,'1','tbl_billing_management was updated','2025-10-18 09:51:35','2025-10-18 09:51:35',NULL),(299,'1','Updated billing for bfg - Amount: ₱4.00 - Bill #000003','2025-10-18 09:51:35','2025-10-18 09:51:35',NULL),(300,'1','tbl_billing_management was created','2025-10-18 10:06:40','2025-10-18 10:06:40',NULL),(301,'1','Created new billing for aaaa - Amount: ₱5.00 - Bill #000001 - Status: sent to owners','2025-10-18 10:06:40','2025-10-18 10:06:40',NULL),(302,'1','tbl_billing_management was updated','2025-10-18 10:07:04','2025-10-18 10:07:04',NULL),(303,'1','Payment submitted for Bill #000001 - Amount: ₱5.00 - Payment method: Main GCash - Status: Under Review','2025-10-18 10:07:04','2025-10-18 10:07:04',NULL),(304,'1','tbl_billing_management was updated','2025-10-18 10:13:38','2025-10-18 10:13:38',NULL),(305,'1','Approved payment for aaaa - Amount: ₱5.00 - Bill #000001','2025-10-18 10:13:38','2025-10-18 10:13:38',NULL),(306,'1','tbl_billing_management was created','2025-10-18 10:18:18','2025-10-18 10:18:18',NULL),(307,'1','Created new billing for aaaa - Amount: ₱5.00 - Bill #000001 - Status: sent to owners','2025-10-18 10:18:18','2025-10-18 10:18:18',NULL),(308,'1','tbl_billing_management was updated','2025-10-18 10:18:33','2025-10-18 10:18:33',NULL),(309,'1','Payment submitted for Bill #000001 - Amount: ₱5.00 - Payment method: Main GCash - Status: Under Review','2025-10-18 10:18:33','2025-10-18 10:18:33',NULL),(310,'1','tbl_billing_management was updated','2025-10-18 10:18:46','2025-10-18 10:18:46',NULL),(311,'1','tbl_billing_management was updated','2025-10-18 10:18:46','2025-10-18 10:18:46',NULL),(312,'1','Approved payment for aaaa - Amount: ₱5.00 - Bill #000001','2025-10-18 10:18:46','2025-10-18 10:18:46',NULL),(313,'1','tbl_billing_management was created','2025-10-18 10:59:29','2025-10-18 10:59:29',NULL),(314,'1','Created new billing for bfg - Amount: ₱5.00 - Bill #000002 - Status: sent to owners','2025-10-18 10:59:29','2025-10-18 10:59:29',NULL),(315,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-18 23:27:22','2025-10-18 23:27:22',NULL),(316,NULL,'tbl_appointment was created','2025-10-19 00:18:19','2025-10-19 00:18:19',NULL),(317,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-19 05:58:09','2025-10-19 05:58:09',NULL),(318,'1','appointment_category was created','2025-10-19 06:33:31','2025-10-19 06:33:31',NULL),(319,'1','appointment_category was created','2025-10-19 06:36:34','2025-10-19 06:36:34',NULL),(320,'1','appointment_category was created','2025-10-19 06:36:43','2025-10-19 06:36:43',NULL),(321,'1','appointment_category was created','2025-10-19 06:42:01','2025-10-19 06:42:01',NULL),(322,'1','appointment_category was created','2025-10-19 06:43:48','2025-10-19 06:43:48',NULL),(323,'1','appointment_category was updated','2025-10-19 06:45:44','2025-10-19 06:45:44',NULL),(324,'1','appointment_category was created','2025-10-19 06:47:44','2025-10-19 06:47:44',NULL),(325,'1','appointment_category was deleted','2025-10-19 06:47:49','2025-10-19 06:47:49',NULL),(326,'1','appointment was created','2025-10-19 06:59:38','2025-10-19 06:59:38',NULL),(327,'1','appointment_schedule_daily was created','2025-10-19 07:38:25','2025-10-19 07:38:25',NULL),(328,'1','appointment_schedule_daily was updated','2025-10-19 07:38:43','2025-10-19 07:38:43',NULL),(329,'1','appointment_schedule_daily was updated','2025-10-19 07:46:00','2025-10-19 07:46:00',NULL),(330,'1','appointment was created','2025-10-19 07:46:15','2025-10-19 07:46:15',NULL),(331,'1','appointment_schedule_daily was created','2025-10-19 07:59:53','2025-10-19 07:59:53',NULL),(332,'1','appointment_schedule_dates was created','2025-10-19 07:59:53','2025-10-19 07:59:53',NULL),(333,'1','appointment_schedule_dates was created','2025-10-19 07:59:53','2025-10-19 07:59:53',NULL),(334,'1','appointment_schedule_dates was created','2025-10-19 07:59:53','2025-10-19 07:59:53',NULL),(335,'1','appointment_schedule_dates was created','2025-10-19 07:59:53','2025-10-19 07:59:53',NULL),(336,'1','appointment_schedule_dates was created','2025-10-19 07:59:53','2025-10-19 07:59:53',NULL),(337,'1','appointment_schedule_dates was created','2025-10-19 07:59:53','2025-10-19 07:59:53',NULL),(338,'1','appointment_schedule_daily was created','2025-10-19 08:14:23','2025-10-19 08:14:23',NULL),(339,'1','appointment_schedule_dates was created','2025-10-19 08:14:23','2025-10-19 08:14:23',NULL),(340,'1','appointment was created','2025-10-19 08:14:45','2025-10-19 08:14:45',NULL),(341,'1','appointment_schedule_daily was updated','2025-10-19 08:20:50','2025-10-19 08:20:50',NULL),(342,'1','appointment_schedule_dates was created','2025-10-19 08:20:50','2025-10-19 08:20:50',NULL),(343,'1','appointment_schedule_dates was created','2025-10-19 08:20:50','2025-10-19 08:20:50',NULL),(344,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-19 10:47:59','2025-10-19 10:47:59',NULL),(345,'1','User was updated','2025-10-19 10:49:16','2025-10-19 10:49:16',NULL),(346,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-19 10:49:16','2025-10-19 10:49:16',NULL),(347,'1','User was updated','2025-10-20 12:10:09','2025-10-20 12:10:09',NULL),(348,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 12:10:10','2025-10-20 12:10:10',NULL),(349,'1','Tenant access disabled for landlord: DENNIS L BONGAITAN - Property: VDVDFVDVFD','2025-10-20 12:12:17','2025-10-20 12:12:17',NULL),(350,'1','Tenant access enabled for landlord: DENNIS L BONGAITAN - Property: VDVDFVDVFD','2025-10-20 12:12:27','2025-10-20 12:12:27',NULL),(351,'1','tbl_billing_management was created','2025-10-20 12:14:00','2025-10-20 12:14:00',NULL),(352,'1','Created new billing for aaaa - Amount: ₱48.00 - Bill #000001 - Status: sent to owners','2025-10-20 12:14:00','2025-10-20 12:14:00',NULL),(353,'1','tbl_billing_management was updated','2025-10-20 12:14:43','2025-10-20 12:14:43',NULL),(354,'1','Payment submitted for Bill #000001 - Amount: ₱48.00 - Payment method: Main GCash - Status: Under Review','2025-10-20 12:14:43','2025-10-20 12:14:43',NULL),(355,'1','tbl_billing_management was updated','2025-10-20 12:15:04','2025-10-20 12:15:04',NULL),(356,'1','tbl_billing_management was updated','2025-10-20 12:15:04','2025-10-20 12:15:04',NULL),(357,'1','Approved payment for aaaa - Amount: ₱48.00 - Bill #000001','2025-10-20 12:15:04','2025-10-20 12:15:04',NULL),(358,'1','User was updated','2025-10-20 12:19:49','2025-10-20 12:19:49',NULL),(359,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 12:19:49','2025-10-20 12:19:49',NULL),(360,'2','User was updated','2025-10-20 12:21:46','2025-10-20 12:21:46',NULL),(361,'2','User logged in successfully from new device: bobo (d@gmail.com) - IP: 210.1.107.2, Location: Davao City, Davao Region, Philippines','2025-10-20 12:21:46','2025-10-20 12:21:46',NULL),(362,'2','User was updated','2025-10-20 12:22:42','2025-10-20 12:22:42',NULL),(363,'2','User logged out: bobo (d@gmail.com) from 210.1.107.2','2025-10-20 12:22:42','2025-10-20 12:22:42',NULL),(364,'1','User was updated','2025-10-20 12:22:47','2025-10-20 12:22:47',NULL),(365,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 12:22:48','2025-10-20 12:22:48',NULL),(366,'1','tbl_billing_management was created','2025-10-20 12:37:21','2025-10-20 12:37:21',NULL),(367,'1','Created new billing for aaaa - Amount: ₱55.00 - Bill #000002 - Status: sent to owners','2025-10-20 12:37:21','2025-10-20 12:37:21',NULL),(368,'1','tbl_billing_management was updated','2025-10-20 12:43:01','2025-10-20 12:43:01',NULL),(369,'1','Updated billing for aaaa - Amount: ₱73.00 - Bill #000001','2025-10-20 12:43:01','2025-10-20 12:43:01',NULL),(370,NULL,'Failed login attempt for user: bfg (clzmiles@gmail.com)','2025-10-20 12:48:55','2025-10-20 12:48:55',NULL),(371,NULL,'Failed login attempt for user: bfg (clzmiles@gmail.com)','2025-10-20 12:48:58','2025-10-20 12:48:58',NULL),(372,'3','User logged in successfully from new device: bfg (clzmiles@gmail.com) - IP: 210.1.107.2, Location: Davao City, Davao Region, Philippines','2025-10-20 12:50:30','2025-10-20 12:50:30',NULL),(373,'1','appointment_category was created','2025-10-20 13:00:10','2025-10-20 13:00:10',NULL),(374,'1','appointment_schedule_daily was deleted','2025-10-20 13:01:16','2025-10-20 13:01:16',NULL),(375,'1','appointment_schedule_daily was updated','2025-10-20 13:01:31','2025-10-20 13:01:31',NULL),(376,'1','appointment_schedule_dates was created','2025-10-20 13:01:32','2025-10-20 13:01:32',NULL),(377,'1','appointment_schedule_dates was created','2025-10-20 13:01:32','2025-10-20 13:01:32',NULL),(378,'1','appointment_schedule_daily was deleted','2025-10-20 13:01:35','2025-10-20 13:01:35',NULL),(379,'1','appointment_schedule_daily was created','2025-10-20 13:02:31','2025-10-20 13:02:31',NULL),(380,'1','appointment_schedule_dates was created','2025-10-20 13:02:31','2025-10-20 13:02:31',NULL),(381,'1','appointment_schedule_dates was created','2025-10-20 13:02:31','2025-10-20 13:02:31',NULL),(382,'1','appointment_schedule_dates was created','2025-10-20 13:02:31','2025-10-20 13:02:31',NULL),(383,'1','appointment_schedule_dates was created','2025-10-20 13:02:31','2025-10-20 13:02:31',NULL),(384,'1','appointment_schedule_dates was created','2025-10-20 13:02:31','2025-10-20 13:02:31',NULL),(385,'1','appointment_schedule_dates was created','2025-10-20 13:03:31','2025-10-20 13:03:31',NULL),(386,'1','appointment_schedule_dates was created','2025-10-20 13:03:31','2025-10-20 13:03:31',NULL),(387,'1','appointment_schedule_dates was created','2025-10-20 13:03:31','2025-10-20 13:03:31',NULL),(388,'1','appointment_schedule_dates was created','2025-10-20 13:03:31','2025-10-20 13:03:31',NULL),(389,'1','appointment_schedule_dates was created','2025-10-20 13:03:31','2025-10-20 13:03:31',NULL),(390,'1','appointment_schedule_dates was created','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(391,'1','appointment_schedule_dates was created','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(392,'1','appointment_schedule_dates was created','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(393,'1','appointment_schedule_dates was created','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(394,'1','appointment_schedule_dates was created','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(395,'1','appointment_schedule_dates was created','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(396,'1','appointment was created','2025-10-20 13:04:49','2025-10-20 13:04:49',NULL),(397,'1','tbl_appointment was updated','2025-10-20 13:05:33','2025-10-20 13:05:33',NULL),(398,'1','Appointment status changed from \'pending\' to \'approved\' for tracking number: A-2025-10-13-016','2025-10-20 13:05:33','2025-10-20 13:05:33',NULL),(399,'1','User was updated','2025-10-20 13:06:38','2025-10-20 13:06:38',NULL),(400,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:06:38','2025-10-20 13:06:38',NULL),(401,NULL,'Failed login attempt for user: aaaa (dennisbongaitan18@gmail.com)','2025-10-20 13:06:48','2025-10-20 13:06:48',NULL),(402,'1','User was updated','2025-10-20 13:07:02','2025-10-20 13:07:02',NULL),(403,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:07:02','2025-10-20 13:07:02',NULL),(404,'1','User was updated','2025-10-20 13:07:45','2025-10-20 13:07:45',NULL),(405,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:07:45','2025-10-20 13:07:45',NULL),(406,'1','User was updated','2025-10-20 13:07:59','2025-10-20 13:07:59',NULL),(407,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:08:00','2025-10-20 13:08:00',NULL),(408,'3','User was updated','2025-10-20 13:10:16','2025-10-20 13:10:16',NULL),(409,'3','User logged out: bfg (clzmiles@gmail.com) from 210.1.107.2','2025-10-20 13:10:16','2025-10-20 13:10:16',NULL),(410,'1','User was updated','2025-10-20 13:12:38','2025-10-20 13:12:38',NULL),(411,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:12:38','2025-10-20 13:12:38',NULL),(412,'1','User was updated','2025-10-20 13:19:33','2025-10-20 13:19:33',NULL),(413,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:19:34','2025-10-20 13:19:34',NULL),(414,'1','appointment was updated','2025-10-20 13:30:36','2025-10-20 13:30:36',NULL),(415,'1','Appointment status changed from \'Pending\' to \'approved\' for tracking number: APT-OQZVGBEB','2025-10-20 13:30:36','2025-10-20 13:30:36',NULL),(416,'1','User was updated','2025-10-20 13:47:53','2025-10-20 13:47:53',NULL),(417,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:47:53','2025-10-20 13:47:53',NULL),(418,NULL,'User was created','2025-10-20 13:50:56','2025-10-20 13:50:56',NULL),(419,NULL,'User was created','2025-10-20 13:51:36','2025-10-20 13:51:36',NULL),(420,NULL,'User was created','2025-10-20 13:55:53','2025-10-20 13:55:53',NULL),(421,'1','User was updated','2025-10-20 13:56:10','2025-10-20 13:56:10',NULL),(422,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 13:56:11','2025-10-20 13:56:11',NULL),(423,'1','User was updated','2025-10-20 14:08:13','2025-10-20 14:08:13',NULL),(424,'1','User activated: bfgbgf (egoogank@gmail.com)','2025-10-20 14:08:13','2025-10-20 14:08:13',NULL),(425,'1','User was updated','2025-10-20 14:08:15','2025-10-20 14:08:15',NULL),(426,'1','User activated: cszdcsdsdccsdcsd (a@gmail.com)','2025-10-20 14:08:15','2025-10-20 14:08:15',NULL),(427,'1','User was updated','2025-10-20 14:08:17','2025-10-20 14:08:17',NULL),(428,'1','User activated: csx csscdcdsscdsc (midone@left4code.com)','2025-10-20 14:08:17','2025-10-20 14:08:17',NULL),(429,'1','User was updated','2025-10-20 14:08:20','2025-10-20 14:08:20',NULL),(430,'1','User deactivated: csx csscdcdsscdsc (midone@left4code.com)','2025-10-20 14:08:20','2025-10-20 14:08:20',NULL),(431,'1','User was updated','2025-10-20 14:08:21','2025-10-20 14:08:21',NULL),(432,'1','User deactivated: cszdcsdsdccsdcsd (a@gmail.com)','2025-10-20 14:08:21','2025-10-20 14:08:21',NULL),(433,'1','User was updated','2025-10-20 14:08:22','2025-10-20 14:08:22',NULL),(434,'1','User deactivated: bfgbgf (egoogank@gmail.com)','2025-10-20 14:08:22','2025-10-20 14:08:22',NULL),(435,'1','User was updated','2025-10-20 14:08:23','2025-10-20 14:08:23',NULL),(436,'1','User activated: bfgbgf (egoogank@gmail.com)','2025-10-20 14:08:23','2025-10-20 14:08:23',NULL),(437,'1','User was updated','2025-10-20 14:08:23','2025-10-20 14:08:23',NULL),(438,'1','User activated: cszdcsdsdccsdcsd (a@gmail.com)','2025-10-20 14:08:23','2025-10-20 14:08:23',NULL),(439,'1','User was updated','2025-10-20 14:08:24','2025-10-20 14:08:24',NULL),(440,'1','User activated: csx csscdcdsscdsc (midone@left4code.com)','2025-10-20 14:08:24','2025-10-20 14:08:24',NULL),(441,'1','User was updated','2025-10-20 14:08:35','2025-10-20 14:08:35',NULL),(442,'1','User logged out: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 14:08:35','2025-10-20 14:08:35',NULL),(443,'1','User was updated','2025-10-20 14:08:41','2025-10-20 14:08:41',NULL),(444,'1','User logged in successfully: aaaa (dennisbongaitan18@gmail.com) from 210.1.107.2','2025-10-20 14:08:41','2025-10-20 14:08:41',NULL),(445,'2','User was updated','2025-10-20 14:20:15','2025-10-20 14:20:15',NULL),(446,'2','User logged in successfully: bobo (d@gmail.com) from 210.1.107.2','2025-10-20 14:20:16','2025-10-20 14:20:16',NULL);
/*!40000 ALTER TABLE `activitylogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applied_landlord`
--

DROP TABLE IF EXISTS `applied_landlord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applied_landlord` (
  `id` int NOT NULL AUTO_INCREMENT,
  `submitted_by` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `middle_initial` varchar(255) DEFAULT NULL,
  `date_of_birth` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `years_of_residency` varchar(255) DEFAULT NULL,
  `property_name` varchar(255) DEFAULT NULL,
  `unit_number` varchar(255) DEFAULT NULL,
  `property_address` varchar(255) DEFAULT NULL,
  `unit_type` varchar(255) DEFAULT NULL,
  `floor_area` varchar(255) DEFAULT NULL,
  `unit_condition` varchar(255) DEFAULT NULL,
  `unit_condition_optional` varchar(255) DEFAULT NULL,
  `supporting_documents` varchar(255) DEFAULT NULL,
  `business_clearance_attachments` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applied_landlord`
--

LOCK TABLES `applied_landlord` WRITE;
/*!40000 ALTER TABLE `applied_landlord` DISABLE KEYS */;
INSERT INTO `applied_landlord` VALUES (1,'1','DENNIS','BONGAITAN','L','2025-10-17 00:00:00','Davao City','Single','Veniam ullamco omni','test@example.com','+1 (404) 952-6165','3','VDVDFVDVFD','VDFVDFFVD','Davao City','Condo','55','Fully Furnished','vfdvfdvfd','landlord_documents/1760707463_482349334_1157297672764892_1296471932904069408_n.jpg','business_clearance_attachments/1760767724_482349334_1157297672764892_1296471932904069408_n.jpg',NULL,'approved','2025-10-17 13:24:23','2025-10-18 06:08:44',NULL);
/*!40000 ALTER TABLE `applied_landlord` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment`
--

DROP TABLE IF EXISTS `appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_category_id` varchar(255) DEFAULT NULL,
  `users_id` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `tracking_number` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment`
--

LOCK TABLES `appointment` WRITE;
/*!40000 ALTER TABLE `appointment` DISABLE KEYS */;
INSERT INTO `appointment` VALUES (1,'1','1','dvfvfdvdffvd','2025-10-19 00:00:00','APT-ZGCHD45D',NULL,'Pending','2025-10-19 08:14:45','2025-10-19 08:14:45',NULL),(2,'4','1','RSTGVTVGRFFGBV','2025-10-20 00:00:00','APT-OQZVGBEB','Your appointment is approved and you may now go to office at that time and date that in your appointment','approved','2025-10-20 13:04:49','2025-10-20 13:30:36',NULL);
/*!40000 ALTER TABLE `appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment_category`
--

DROP TABLE IF EXISTS `appointment_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_category`
--

LOCK TABLES `appointment_category` WRITE;
/*!40000 ALTER TABLE `appointment_category` DISABLE KEYS */;
INSERT INTO `appointment_category` VALUES (1,'CDSCDSCDS','Active','2025-10-19 06:42:01','2025-10-19 06:42:01',NULL),(2,'CDSCSDCSDCDSCSDCSD','Inactive','2025-10-19 06:43:48','2025-10-19 06:45:44',NULL),(3,'vvvv','Active','2025-10-19 06:47:44','2025-10-19 06:47:49','2025-10-19 06:47:49'),(4,'Business Permit','Active','2025-10-20 13:00:10','2025-10-20 13:00:10',NULL);
/*!40000 ALTER TABLE `appointment_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment_schedule_daily`
--

DROP TABLE IF EXISTS `appointment_schedule_daily`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_schedule_daily` (
  `id` int NOT NULL AUTO_INCREMENT,
  `allow_number_of_appointment` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_schedule_daily`
--

LOCK TABLES `appointment_schedule_daily` WRITE;
/*!40000 ALTER TABLE `appointment_schedule_daily` DISABLE KEYS */;
INSERT INTO `appointment_schedule_daily` VALUES (3,'10','Active','2025-10-20 13:02:31','2025-10-20 13:02:31',NULL);
/*!40000 ALTER TABLE `appointment_schedule_daily` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointment_schedule_dates`
--

DROP TABLE IF EXISTS `appointment_schedule_dates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointment_schedule_dates` (
  `id` int NOT NULL AUTO_INCREMENT,
  `appointment_schedule_daily_id` varchar(255) DEFAULT NULL,
  `day` varchar(255) DEFAULT NULL,
  `dates` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointment_schedule_dates`
--

LOCK TABLES `appointment_schedule_dates` WRITE;
/*!40000 ALTER TABLE `appointment_schedule_dates` DISABLE KEYS */;
INSERT INTO `appointment_schedule_dates` VALUES (1,'1','Monday','2025-10-20','Active','2025-10-19 07:59:53','2025-10-19 08:20:50','2025-10-19 08:20:50'),(2,'1','Tuesday','2025-10-21','Active','2025-10-19 07:59:53','2025-10-19 08:20:50','2025-10-19 08:20:50'),(3,'1','Wednesday','2025-10-22','Active','2025-10-19 07:59:53','2025-10-19 08:20:50','2025-10-19 08:20:50'),(4,'1','Thursday','2025-10-23','Active','2025-10-19 07:59:53','2025-10-19 08:20:50','2025-10-19 08:20:50'),(5,'1','Friday','2025-10-24','Active','2025-10-19 07:59:53','2025-10-19 08:20:50','2025-10-19 08:20:50'),(6,'1','Saturday','2025-10-25','Active','2025-10-19 07:59:53','2025-10-19 08:20:50','2025-10-19 08:20:50'),(7,'2','Sunday','2025-10-19','Active','2025-10-19 08:14:23','2025-10-19 08:14:23',NULL),(8,'1','Monday','2025-10-20','Active','2025-10-19 08:20:50','2025-10-20 13:01:31','2025-10-20 13:01:31'),(9,'1','Tuesday','2025-10-21','Active','2025-10-19 08:20:50','2025-10-20 13:01:31','2025-10-20 13:01:31'),(10,'1','Monday','2025-10-20','Active','2025-10-20 13:01:31','2025-10-20 13:01:31',NULL),(11,'1','Tuesday','2025-10-21','Active','2025-10-20 13:01:32','2025-10-20 13:01:32',NULL),(12,'3','Monday','2025-10-20','Active','2025-10-20 13:02:31','2025-10-20 13:03:31','2025-10-20 13:03:31'),(13,'3','Tuesday','2025-10-21','Active','2025-10-20 13:02:31','2025-10-20 13:03:31','2025-10-20 13:03:31'),(14,'3','Wednesday','2025-10-22','Active','2025-10-20 13:02:31','2025-10-20 13:03:31','2025-10-20 13:03:31'),(15,'3','Thursday','2025-10-23','Active','2025-10-20 13:02:31','2025-10-20 13:03:31','2025-10-20 13:03:31'),(16,'3','Friday','2025-10-24','Active','2025-10-20 13:02:31','2025-10-20 13:03:31','2025-10-20 13:03:31'),(17,'3','Tuesday','2025-10-21','Active','2025-10-20 13:03:31','2025-10-20 13:04:37','2025-10-20 13:04:37'),(18,'3','Wednesday','2025-10-22','Active','2025-10-20 13:03:31','2025-10-20 13:04:37','2025-10-20 13:04:37'),(19,'3','Thursday','2025-10-23','Active','2025-10-20 13:03:31','2025-10-20 13:04:37','2025-10-20 13:04:37'),(20,'3','Friday','2025-10-24','Active','2025-10-20 13:03:31','2025-10-20 13:04:37','2025-10-20 13:04:37'),(21,'3','Saturday','2025-10-25','Active','2025-10-20 13:03:31','2025-10-20 13:04:37','2025-10-20 13:04:37'),(22,'3','Monday','2025-10-20','Active','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(23,'3','Tuesday','2025-10-21','Active','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(24,'3','Wednesday','2025-10-22','Active','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(25,'3','Thursday','2025-10-23','Active','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(26,'3','Friday','2025-10-24','Active','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL),(27,'3','Saturday','2025-10-25','Active','2025-10-20 13:04:37','2025-10-20 13:04:37',NULL);
/*!40000 ALTER TABLE `appointment_schedule_dates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `business_management_list`
--

DROP TABLE IF EXISTS `business_management_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `business_management_list` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_of_business` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `business_clearance` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `business_management_list_user_id_foreign` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `business_management_list`
--

LOCK TABLES `business_management_list` WRITE;
/*!40000 ALTER TABLE `business_management_list` DISABLE KEYS */;
INSERT INTO `business_management_list` VALUES (1,'2','csdcsdcsdcsd','cdscsdcsd','business-clearances/1760230346_482349334_1157297672764892_1296471932904069408_n.jpg','csdcsdsdccsd','declined','csdcdscsdscd','2025-10-12 00:52:26','2025-10-12 00:59:37',NULL),(2,'1','csdcdcscds','cdcdscdscsdcds','business-clearances/1760706661_482349334_1157297672764892_1296471932904069408_n.jpg','vfdvfdvfd','approved',NULL,'2025-10-17 13:11:01','2025-10-20 12:17:28',NULL),(3,'1','dfvsvfdvfdfvd','vffvdvfdvfdvfd','business-clearances/1760965021_Gemini_Generated_Image_eb9ftkeb9ftkeb9f.png','vfdfvdvfddfv','approved',NULL,'2025-10-20 12:57:01','2025-10-20 12:57:27',NULL);
/*!40000 ALTER TABLE `business_management_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ch_favorites`
--

DROP TABLE IF EXISTS `ch_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ch_favorites` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint NOT NULL,
  `favorite_id` bigint NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ch_favorites`
--

LOCK TABLES `ch_favorites` WRITE;
/*!40000 ALTER TABLE `ch_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `ch_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ch_messages`
--

DROP TABLE IF EXISTS `ch_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ch_messages` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_id` bigint NOT NULL,
  `to_id` bigint NOT NULL,
  `body` varchar(5000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attachment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seen` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ch_messages`
--

LOCK TABLES `ch_messages` WRITE;
/*!40000 ALTER TABLE `ch_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `ch_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chatbot_messages`
--

DROP TABLE IF EXISTS `chatbot_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chatbot_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_guest_id` varchar(255) DEFAULT NULL,
  `from_users_id` varchar(255) DEFAULT NULL,
  `message` longtext,
  `parent_id` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chatbot_messages`
--

LOCK TABLES `chatbot_messages` WRITE;
/*!40000 ALTER TABLE `chatbot_messages` DISABLE KEYS */;
INSERT INTO `chatbot_messages` VALUES (1,'GUEST-1760613657626-n27n0ujiwg9',NULL,'cdfscdsdc',NULL,'pending','2025-10-16 11:26:09','2025-10-16 11:26:09',NULL),(2,'GUEST-1760613657626-n27n0ujiwg9',NULL,'I understand you\'re asking about: \"cdfscdsdc\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-16 11:26:09','2025-10-16 11:26:09',NULL),(3,'GUEST-1760613657626-n27n0ujiwg9',NULL,'bbfgbgffbgfbg',NULL,'pending','2025-10-16 11:26:39','2025-10-16 11:26:39',NULL),(4,'GUEST-1760613657626-n27n0ujiwg9',NULL,'I understand you\'re asking about: \"bbfgbgffbgfbg\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-16 11:26:39','2025-10-16 11:26:39',NULL),(5,'GUEST-1760613657626-n27n0ujiwg9','1','vdfdfvdvfdfv','3','admin_reply','2025-10-16 11:34:57','2025-10-16 11:34:57',NULL),(6,'GUEST-1760613657626-n27n0ujiwg9',NULL,'vdfvdfdvfvdf',NULL,'pending','2025-10-16 11:40:54','2025-10-16 11:40:54',NULL),(7,'GUEST-1760613657626-n27n0ujiwg9',NULL,'I understand you\'re asking about: \"vdfvdfdvfvdf\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-16 11:40:54','2025-10-16 11:40:54',NULL),(8,'GUEST-1760613657626-n27n0ujiwg9','1','gbfbfgfbfbgfb','6','admin_reply','2025-10-16 11:41:07','2025-10-16 11:41:07',NULL),(9,'GUEST-1760613657626-n27n0ujiwg9',NULL,'vfdvdffvdfdv',NULL,'pending','2025-10-16 11:43:55','2025-10-16 11:43:55',NULL),(10,'GUEST-1760613657626-n27n0ujiwg9',NULL,'I understand you\'re asking about: \"vfdvdffvdfdv\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-16 11:43:55','2025-10-16 11:43:55',NULL),(11,'GUEST-1760613657626-n27n0ujiwg9','1','bfggbfgbffgb','9','admin_reply','2025-10-16 11:44:05','2025-10-16 11:44:05',NULL),(12,'GUEST-1760613657626-n27n0ujiwg9',NULL,'bfgbfgfgbbfg',NULL,'pending','2025-10-16 11:44:20','2025-10-16 11:44:20',NULL),(13,'GUEST-1760613657626-n27n0ujiwg9',NULL,'I understand you\'re asking about: \"bfgbfgfgbbfg\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-16 11:44:20','2025-10-16 11:44:20',NULL),(14,'GUEST-1760615199636-fy0gt68cgur',NULL,'cdscdscdscsdcds',NULL,'pending','2025-10-16 11:46:45','2025-10-16 11:46:45',NULL),(15,'GUEST-1760615199636-fy0gt68cgur',NULL,'I understand you\'re asking about: \"cdscdscdscsdcds\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-16 11:46:45','2025-10-16 11:46:45',NULL),(16,'GUEST-1760615199636-fy0gt68cgur','1','vdfvfdvfdvfdvdf','14','admin_reply','2025-10-16 11:46:55','2025-10-16 11:46:55',NULL),(17,'GUEST-1760615225755-b8e0yxm7lg',NULL,'gg',NULL,'replied','2025-10-16 11:47:11','2025-10-16 11:55:11',NULL),(18,'GUEST-1760615225755-b8e0yxm7lg',NULL,'I understand you\'re asking about: \"gg\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-16 11:47:11','2025-10-16 11:47:11',NULL),(19,'GUEST-1760615225755-b8e0yxm7lg','1','dvffffffffffffffffffffffff','17','admin_reply','2025-10-16 11:47:22','2025-10-16 11:47:22',NULL),(20,'GUEST-1760615225755-b8e0yxm7lg','1','bfgbfgbgfbfg','17','admin_reply','2025-10-16 11:55:11','2025-10-16 11:55:11',NULL),(21,'GUEST-1760965816918-0gbb322exz8u',NULL,'vfdvfdvfdv',NULL,'replied','2025-10-20 13:10:31','2025-10-20 13:10:40',NULL),(22,'GUEST-1760965816918-0gbb322exz8u',NULL,'I understand you\'re asking about: \"vfdvfdvfdv\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-20 13:10:31','2025-10-20 13:10:31',NULL),(23,'GUEST-1760965816918-0gbb322exz8u','1','vdvfvdvfvd','21','admin_reply','2025-10-20 13:10:40','2025-10-20 13:10:40',NULL),(24,'USER-1',NULL,'csdcdscdscsd',NULL,'pending','2025-10-20 13:38:39','2025-10-20 13:38:39',NULL),(25,'USER-1',NULL,'I understand you\'re asking about: \"csdcdscdscsd\". I can help you with vehicle management, business registration, service requests, incident reports, and user management. Could you be more specific about what you need help with?',NULL,'bot_response','2025-10-20 13:38:39','2025-10-20 13:38:39',NULL);
/*!40000 ALTER TABLE `chatbot_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `landlord_permission`
--

DROP TABLE IF EXISTS `landlord_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `landlord_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `applied_landlord_id` varchar(255) DEFAULT NULL,
  `has_have_permission` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `landlord_permission`
--

LOCK TABLES `landlord_permission` WRITE;
/*!40000 ALTER TABLE `landlord_permission` DISABLE KEYS */;
INSERT INTO `landlord_permission` VALUES (1,'1','1','active','2025-10-18 06:38:29','2025-10-20 12:12:27',NULL);
/*!40000 ALTER TABLE `landlord_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_id` varchar(45) DEFAULT NULL,
  `message` longtext,
  `to_id` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,'1','bobo','2','read','2025-10-11 08:56:43','2025-10-11 09:01:03',NULL),(2,'1','dvfcfdvvdf','2','read','2025-10-11 08:57:21','2025-10-11 09:01:03',NULL),(3,'2','hoy','1','read','2025-10-11 09:01:08','2025-10-11 09:24:48',NULL),(4,'2','fgvbfgbfgfbg','1','read','2025-10-11 09:16:34','2025-10-11 09:24:48',NULL),(5,'2','cdscsdcsdcsd','1','read','2025-10-11 09:23:59','2025-10-11 09:24:48',NULL),(6,'1','vdfcvdfvfddfv','2','read','2025-10-11 09:25:12','2025-10-11 09:35:22',NULL),(7,'1','fvvfdvdfdfv','2','read','2025-10-11 09:32:42','2025-10-11 09:35:22',NULL),(8,'2','csdcsdcsdcsdscdcsd','1','read','2025-10-11 09:35:25','2025-10-11 09:36:24',NULL),(9,'1','test','2','read','2025-10-20 12:19:08','2025-10-20 12:22:27',NULL),(10,'2','reply','1','read','2025-10-20 12:22:37','2025-10-20 12:22:57',NULL),(11,'2','csdcsdcsdcsd','1','read','2025-10-20 14:20:27','2025-10-20 14:20:55',NULL),(12,'2','Floating chat initializing...\ndashboard:2967 Floating chat initialized','1','read','2025-10-20 14:21:10','2025-10-20 14:22:40',NULL),(13,'2','csdcsdcsd','1','read','2025-10-20 14:22:32','2025-10-20 14:22:40',NULL),(14,'2','dfvvfdfvdvfd','1','read','2025-10-20 14:25:13','2025-10-20 14:25:17',NULL),(15,'2','csdcsdcdscsd','1','read','2025-10-20 14:27:16','2025-10-20 14:27:19',NULL),(16,'2','csdsdcdcs','1','read','2025-10-20 14:27:44','2025-10-20 14:27:48',NULL),(17,'2','csdcdsdsc','1','read','2025-10-20 14:28:21','2025-10-20 14:28:24',NULL),(18,'1','yes','2','read','2025-10-20 14:28:32','2025-10-20 14:28:33',NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2024_01_01_000001_create_business_management_list_table',1),(6,'2024_01_01_000002_create_tbl_entry_data_table',1),(7,'2024_01_01_000003_create_tbl_entry_data_product_table',1),(8,'2024_01_01_000004_create_vehicle_management_list_table',1),(9,'2024_01_01_000005_create_vehicle_details_table',1),(10,'2024_01_01_000006_create_tbl_appointment_table',1),(11,'2025_08_19_999999_add_active_status_to_users',1),(12,'2025_08_19_999999_add_avatar_to_users',1),(13,'2025_08_19_999999_add_dark_mode_to_users',1),(14,'2025_08_19_999999_add_messenger_color_to_users',1),(15,'2025_08_19_999999_create_chatify_favorites_table',1),(16,'2025_08_19_999999_create_chatify_messages_table',1),(17,'2025_08_20_004909_create_tbl_incident_report_table',1),(18,'2025_08_30_000100_create_tbl_announcement_table',1),(19,'2025_08_30_000110_create_tbl_bank_account_type_table',1),(20,'2025_08_30_000120_create_tbl_bank_account_category_table',1),(21,'2025_08_30_000130_create_tbl_billing_management_table',1),(22,'2025_08_30_000140_create_tbl_billing_management_list_table',1),(23,'2025_08_30_000150_create_tbl_feedback_table',1),(24,'2025_08_30_000160_create_tbl_otp_table',1),(25,'2025_08_30_000170_create_tbl_service_management_type_table',1),(26,'2025_08_30_000180_create_tbl_service_management_category_table',1),(27,'2025_08_30_000190_create_tbl_service_management_complaints_table',1),(28,'2025_08_30_000200_create_tbl_tenant_list_table',1),(29,'2025_08_30_000210_create_tbl_vehicle_homeowners_table',1),(30,'2025_08_30_000220_create_tbl_vehicle_homeowners_supporting_documents_table',1),(31,'2025_08_30_000230_create_tbl_vehicle_list_details_homeowners_table',1),(32,'2025_08_30_000300_update_existing_tables_to_strings',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `module`
--

DROP TABLE IF EXISTS `module`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `module` (
  `id` int NOT NULL AUTO_INCREMENT,
  `module_name` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `module`
--

LOCK TABLES `module` WRITE;
/*!40000 ALTER TABLE `module` DISABLE KEYS */;
INSERT INTO `module` VALUES (1,'dashboard','active','2025-09-21 01:05:33',NULL,NULL),(2,'message','active','2025-09-21 01:05:33',NULL,NULL),(3,'feedback','active','2025-09-21 01:05:33',NULL,NULL),(4,'service request','active','2025-09-21 01:05:33',NULL,NULL),(5,'incident request','active','2025-09-21 01:05:33',NULL,NULL),(6,'billing payment','active','2025-09-21 01:05:33',NULL,NULL),(7,'vehicle','active','2025-09-21 01:05:33',NULL,NULL),(8,'user management','active','2025-09-21 01:05:33',NULL,NULL),(9,'business management','active','2025-09-21 01:05:33',NULL,NULL),(10,'vehicle management','active','2025-09-21 01:05:33',NULL,NULL),(11,'service management','active','2025-09-21 01:05:33',NULL,NULL),(12,'incident management','active','2025-09-21 01:05:33',NULL,NULL),(13,'announcement','active','2025-09-21 01:05:33',NULL,NULL),(14,'billing management','active','2025-09-21 01:05:33',NULL,NULL),(15,'payment account management','active','2025-09-21 01:05:33',NULL,NULL),(16,'feedback management','active','2025-09-21 01:05:33',NULL,NULL),(17,'appointment management','active','2025-09-21 01:05:33',NULL,NULL),(19,'notification settings','active','2025-09-21 05:32:35',NULL,NULL),(20,'system settings','active','2025-09-21 05:32:58',NULL,NULL),(21,'Permission Settings','active','2025-09-21 05:32:58',NULL,NULL),(22,'apply business','active','2025-10-12 00:33:13',NULL,NULL),(23,'incident report','active','2025-10-12 02:59:16',NULL,NULL);
/*!40000 ALTER TABLE `module` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `notification_settings_id` varchar(45) DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'2','info','New Billing Created','A new billing has been created for you - Amount: ₱10.00 for Bill #000001. Please check your billing details and make payment when ready.',NULL,'2025-09-21 01:58:28','2025-09-21 01:58:18','2025-09-21 01:58:28',NULL),(2,'2','success','Payment Submitted Successfully','Your payment of ₱10.00 for Bill #000001 has been submitted and is now under review. You will be notified once it is processed.',NULL,'2025-09-21 01:59:39','2025-09-21 01:59:34','2025-09-21 01:59:39',NULL),(3,'1','info','New Payment Submitted','bobo has submitted a payment of ₱10.00 for Bill #000001. Payment method: Main GCash. Payment has been submitted and is under review.','1','2025-09-21 01:59:40','2025-09-21 01:59:34','2025-09-21 01:59:40',NULL),(4,'2','error','Payment Rejected','Your payment of ₱10.00 for Bill #000001 has been rejected. Reason: vfdfvdfvdvdf',NULL,'2025-09-21 02:04:59','2025-09-21 02:04:41','2025-09-21 02:04:59',NULL),(5,'2','success','Payment Submitted Successfully','Your payment of ₱10.00 for Bill #000001 has been submitted and is now under review. You will be notified once it is processed.',NULL,'2025-09-21 02:05:19','2025-09-21 02:05:13','2025-09-21 02:05:19',NULL),(6,'1','info','New Payment Submitted','bobo has submitted a payment of ₱10.00 for Bill #000001. Payment method: Main GCash. Payment has been submitted and is under review.','1','2025-09-21 02:05:26','2025-09-21 02:05:13','2025-09-21 02:05:26',NULL),(7,'2','success','Payment Approved','Your payment of ₱10.00 for Bill #000001 has been approved and processed successfully.',NULL,'2025-09-21 02:05:37','2025-09-21 02:05:30','2025-09-21 02:05:37',NULL),(8,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-09-21 04:33:45','2025-09-21 04:33:38','2025-09-21 04:33:45',NULL),(9,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-09-21 22:58:46','2025-09-21 22:57:35','2025-09-21 22:58:46',NULL),(10,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-09-21 23:08:33','2025-09-21 23:08:26','2025-09-21 23:08:33',NULL),(11,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-09-21 23:31:03','2025-09-21 23:30:56','2025-09-21 23:31:03',NULL),(12,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-09-22 11:57:36','2025-09-22 11:57:30','2025-09-22 11:57:36',NULL),(13,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-09-22 12:07:59','2025-09-22 12:07:54','2025-09-22 12:07:59',NULL),(14,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-09-22 12:08:19','2025-09-22 12:08:14','2025-09-22 12:08:19',NULL),(15,'1','info','New Billing Created','A new billing has been created for you - Amount: ₱11.00 for Bill #000002. Please check your billing details and make payment when ready.','1','2025-09-22 12:10:59','2025-09-22 12:10:55','2025-09-22 12:10:59',NULL),(16,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-10-11 08:19:49','2025-10-11 08:19:38','2025-10-11 08:19:49',NULL),(17,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-11 08:58:50','2025-10-11 08:58:44','2025-10-11 08:58:50',NULL),(18,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-10-11 08:59:27','2025-10-11 08:59:20','2025-10-11 08:59:27',NULL),(19,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-11 09:01:00','2025-10-11 09:00:55','2025-10-11 09:01:00',NULL),(20,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-10-11 09:24:50','2025-10-11 09:24:42','2025-10-11 09:24:50',NULL),(21,'2','message','New Message','You have a new message from Left4code',NULL,'2025-10-11 09:33:00','2025-10-11 09:32:42','2025-10-11 09:33:00',NULL),(22,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-11 09:32:58','2025-10-11 09:32:53','2025-10-11 09:32:58',NULL),(23,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-11 09:35:46','2025-10-11 09:35:25','2025-10-11 09:35:46',NULL),(24,'1','success','Welcome Back!','Hello Left4code, welcome back to Golden Country Homes!',NULL,'2025-10-11 09:35:44','2025-10-11 09:35:38','2025-10-11 09:35:44',NULL),(25,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-11 23:39:38','2025-10-11 23:39:30','2025-10-11 23:39:38',NULL),(26,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-12 00:39:29','2025-10-12 00:39:23','2025-10-12 00:39:29',NULL),(27,'1','info','New Business Registration','New business \'cdcdscdscsdcds\' has been registered by bobo','2','2025-10-12 00:45:39','2025-10-12 00:44:32','2025-10-12 00:45:39',NULL),(28,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 00:45:37','2025-10-12 00:45:32','2025-10-12 00:45:37',NULL),(29,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-12 00:52:20','2025-10-12 00:52:12','2025-10-12 00:52:20',NULL),(30,'1','info','New Business Registration','New business \'cdscsdcsd\' has been registered by bobo','2','2025-10-12 00:52:50','2025-10-12 00:52:26','2025-10-12 00:52:50',NULL),(31,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 00:52:48','2025-10-12 00:52:42','2025-10-12 00:52:48',NULL),(32,'2','success','Business Approved','Your business \'cdscsdcsd\' has been approved!',NULL,'2025-10-12 00:58:13','2025-10-12 00:57:46','2025-10-12 00:58:13',NULL),(33,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-12 00:58:11','2025-10-12 00:58:05','2025-10-12 00:58:11',NULL),(34,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 00:59:02','2025-10-12 00:58:56','2025-10-12 00:59:02',NULL),(35,'2','error','Business Declined','Your business \'cdscsdcsd\' has been declined. Reason: csdcdscsdscd',NULL,'2025-10-12 01:00:02','2025-10-12 00:59:37','2025-10-12 01:00:02',NULL),(36,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-12 01:00:00','2025-10-12 00:59:51','2025-10-12 01:00:00',NULL),(37,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 01:00:23','2025-10-12 01:00:18','2025-10-12 01:00:23',NULL),(38,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 01:11:45','2025-10-12 01:11:39','2025-10-12 01:11:45',NULL),(39,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 01:19:29','2025-10-12 01:19:22','2025-10-12 01:19:29',NULL),(40,'3','success','Welcome Back!','Hello bfg, welcome back to Golden Country Homes!',NULL,'2025-10-12 03:08:18','2025-10-12 03:08:13','2025-10-12 03:08:18',NULL),(41,'3','success','Welcome Back!','Hello bfg, welcome back to Golden Country Homes!',NULL,'2025-10-12 03:10:34','2025-10-12 03:10:29','2025-10-12 03:10:34',NULL),(42,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 03:11:00','2025-10-12 03:10:54','2025-10-12 03:11:00',NULL),(43,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 03:11:37','2025-10-12 03:11:31','2025-10-12 03:11:37',NULL),(44,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 10:57:53','2025-10-12 10:57:46','2025-10-12 10:57:53',NULL),(45,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-12 11:06:53','2025-10-12 11:06:45','2025-10-12 11:06:53',NULL),(46,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-13 11:57:35','2025-10-13 11:57:18','2025-10-13 11:57:35',NULL),(47,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-13 12:36:30','2025-10-13 12:36:24','2025-10-13 12:36:30',NULL),(48,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-13 12:42:57','2025-10-13 12:42:51','2025-10-13 12:42:57',NULL),(49,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-16 11:27:47','2025-10-16 11:27:34','2025-10-16 11:27:47',NULL),(50,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-16 12:07:20','2025-10-16 12:07:13','2025-10-16 12:07:20',NULL),(51,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-17 11:41:34','2025-10-17 11:41:28','2025-10-17 11:41:34',NULL),(52,'1','info','New Business Registration','New business \'cdcdscdscsdcds\' has been registered by aaaa','2','2025-10-17 13:11:07','2025-10-17 13:11:01','2025-10-17 13:11:07',NULL),(53,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 00:24:05','2025-10-18 00:23:58','2025-10-18 00:24:05',NULL),(54,'1','success','Payment Submitted Successfully','Your payment of ₱11.00 for Bill #000002 has been submitted and is now under review. You will be notified once it is processed.','1','2025-10-18 00:52:19','2025-10-18 00:52:14','2025-10-18 00:52:19',NULL),(55,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 05:28:59','2025-10-18 05:28:53','2025-10-18 05:28:59',NULL),(56,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 08:20:46','2025-10-18 08:20:40','2025-10-18 08:20:46',NULL),(57,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 08:22:18','2025-10-18 08:22:12','2025-10-18 08:22:18',NULL),(58,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 08:25:24','2025-10-18 08:25:17','2025-10-18 08:25:24',NULL),(59,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 08:33:33','2025-10-18 08:33:26','2025-10-18 08:33:33',NULL),(60,'1','success','Welcome Back!','Hello aaaa, you have successfully logged in from a new device.',NULL,'2025-10-18 08:41:43','2025-10-18 08:41:27','2025-10-18 08:41:43',NULL),(61,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 08:44:53','2025-10-18 08:44:45','2025-10-18 08:44:53',NULL),(62,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 09:05:15','2025-10-18 09:05:09','2025-10-18 09:05:15',NULL),(63,'3','info','New Billing Created','A new billing has been created for you - Amount: ₱4.00 for Bill #000003. Please check your billing details and make payment when ready.',NULL,'2025-10-20 12:50:52','2025-10-18 09:40:20','2025-10-20 12:50:52',NULL),(64,'1','info','New Billing Created','A new billing has been created for you - Amount: ₱5.00 for Bill #000001. Please check your billing details and make payment when ready.','1','2025-10-18 10:06:45','2025-10-18 10:06:40','2025-10-18 10:06:45',NULL),(65,'1','success','Payment Submitted Successfully','Your payment of ₱5.00 for Bill #000001 has been submitted and is now under review. You will be notified once it is processed.','1','2025-10-18 10:07:11','2025-10-18 10:07:04','2025-10-18 10:07:11',NULL),(66,'1','success','Payment Approved','Your payment of ₱5.00 for Bill #000001 has been approved and processed successfully.','1','2025-10-18 10:13:43','2025-10-18 10:13:38','2025-10-18 10:13:43',NULL),(67,'1','info','New Billing Created','A new billing has been created for you - Amount: ₱5.00 for Bill #000001. Please check your billing details and make payment when ready.','1','2025-10-18 10:18:23','2025-10-18 10:18:18','2025-10-18 10:18:23',NULL),(68,'1','success','Payment Submitted Successfully','Your payment of ₱5.00 for Bill #000001 has been submitted and is now under review. You will be notified once it is processed.','1','2025-10-18 10:18:40','2025-10-18 10:18:33','2025-10-18 10:18:40',NULL),(69,'1','success','Payment Approved','Your payment of ₱5.00 for Bill #000001 has been approved and processed successfully.','1','2025-10-18 10:18:50','2025-10-18 10:18:46','2025-10-18 10:18:50',NULL),(70,'3','info','New Billing Created','A new billing has been created for you - Amount: ₱5.00 for Bill #000002. Please check your billing details and make payment when ready.',NULL,'2025-10-20 12:50:49','2025-10-18 10:59:29','2025-10-20 12:50:49',NULL),(71,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-18 23:27:29','2025-10-18 23:27:22','2025-10-18 23:27:29',NULL),(72,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-19 05:58:15','2025-10-19 05:58:09','2025-10-19 05:58:15',NULL),(73,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-19 10:48:07','2025-10-19 10:47:59','2025-10-19 10:48:07',NULL),(74,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-20 12:10:21','2025-10-20 12:10:10','2025-10-20 12:10:21',NULL),(75,'1','info','New Billing Created','A new billing has been created for you - Amount: ₱48.00 for Bill #000001. Please check your billing details and make payment when ready.','1','2025-10-20 12:14:05','2025-10-20 12:14:00','2025-10-20 12:14:05',NULL),(76,'1','success','Payment Submitted Successfully','Your payment of ₱48.00 for Bill #000001 has been submitted and is now under review. You will be notified once it is processed.','1','2025-10-20 12:14:48','2025-10-20 12:14:43','2025-10-20 12:14:48',NULL),(77,'1','success','Payment Approved','Your payment of ₱48.00 for Bill #000001 has been approved and processed successfully.','1','2025-10-20 12:15:08','2025-10-20 12:15:04','2025-10-20 12:15:08',NULL),(78,'1','success','Business Approved','Your business \'cdcdscdscsdcds\' has been approved!','2','2025-10-20 12:17:33','2025-10-20 12:17:28','2025-10-20 12:17:33',NULL),(79,'2','message','New Message','You have a new message from aaaa',NULL,'2025-10-20 12:22:07','2025-10-20 12:19:08','2025-10-20 12:22:07',NULL),(80,'2','success','Welcome Back!','Hello bobo, you have successfully logged in from a new device.',NULL,'2025-10-20 12:22:05','2025-10-20 12:21:46','2025-10-20 12:22:05',NULL),(81,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 12:22:58','2025-10-20 12:22:37','2025-10-20 12:22:58',NULL),(82,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-20 12:22:53','2025-10-20 12:22:48','2025-10-20 12:22:53',NULL),(83,'1','info','New Billing Created','A new billing has been created for you - Amount: ₱55.00 for Bill #000002. Please check your billing details and make payment when ready.','1','2025-10-20 12:37:26','2025-10-20 12:37:21','2025-10-20 12:37:26',NULL),(84,'3','success','Welcome Back!','Hello bfg, you have successfully logged in from a new device.',NULL,'2025-10-20 12:50:47','2025-10-20 12:50:30','2025-10-20 12:50:47',NULL),(85,'1','info','New Business Registration','New business \'vffvdvfdvfdvfd\' has been registered by aaaa','2','2025-10-20 12:57:06','2025-10-20 12:57:01','2025-10-20 12:57:06',NULL),(86,'1','success','Business Approved','Your business \'vffvdvfdvfdvfd\' has been approved!','2','2025-10-20 12:57:32','2025-10-20 12:57:27','2025-10-20 12:57:32',NULL),(87,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-20 13:07:10','2025-10-20 13:07:02','2025-10-20 13:07:10',NULL),(88,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-20 13:08:07','2025-10-20 13:08:00','2025-10-20 13:08:07',NULL),(89,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-20 13:19:43','2025-10-20 13:19:34','2025-10-20 13:19:43',NULL),(90,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-20 13:56:16','2025-10-20 13:56:11','2025-10-20 13:56:16',NULL),(91,'1','success','Welcome Back!','Hello aaaa, welcome back to Golden Country Homes!',NULL,'2025-10-20 14:08:47','2025-10-20 14:08:41','2025-10-20 14:08:47',NULL),(92,'2','success','Welcome Back!','Hello bobo, welcome back to Golden Country Homes!',NULL,'2025-10-20 14:20:26','2025-10-20 14:20:16','2025-10-20 14:20:26',NULL),(93,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 14:20:42','2025-10-20 14:20:27','2025-10-20 14:20:42',NULL),(94,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 14:22:28','2025-10-20 14:21:10','2025-10-20 14:22:28',NULL),(95,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 14:25:10','2025-10-20 14:22:32','2025-10-20 14:25:10',NULL),(96,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 14:26:27','2025-10-20 14:25:13','2025-10-20 14:26:27',NULL),(97,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 14:27:46','2025-10-20 14:27:16','2025-10-20 14:27:46',NULL),(98,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 14:28:22','2025-10-20 14:27:44','2025-10-20 14:28:22',NULL),(99,'1','message','New Message','You have a new message from bobo',NULL,'2025-10-20 14:28:52','2025-10-20 14:28:21','2025-10-20 14:28:52',NULL),(100,'2','message','New Message','You have a new message from aaaa',NULL,NULL,'2025-10-20 14:28:32','2025-10-20 14:28:32',NULL);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification_settings`
--

DROP TABLE IF EXISTS `notification_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `module_id` varchar(255) DEFAULT NULL,
  `users_id` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification_settings`
--

LOCK TABLES `notification_settings` WRITE;
/*!40000 ALTER TABLE `notification_settings` DISABLE KEYS */;
INSERT INTO `notification_settings` VALUES (1,'14','1','active','2025-09-21 01:12:27','2025-09-21 01:14:20',NULL),(2,'22','1','active','2025-10-12 00:33:37','2025-10-12 00:33:37',NULL);
/*!40000 ALTER TABLE `notification_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_settings`
--

DROP TABLE IF EXISTS `permission_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_settings`
--

LOCK TABLES `permission_settings` WRITE;
/*!40000 ALTER TABLE `permission_settings` DISABLE KEYS */;
INSERT INTO `permission_settings` VALUES (1,'1','active','2025-09-21 05:17:29','2025-09-21 05:30:43','2025-09-21 05:30:43'),(2,'1','active','2025-09-21 05:30:29','2025-09-21 05:30:29',NULL),(3,'2','active','2025-09-22 12:07:40','2025-09-22 12:07:40',NULL),(4,'1','active','2025-10-12 02:59:38','2025-10-12 03:01:30','2025-10-12 03:01:30');
/*!40000 ALTER TABLE `permission_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_settings_list`
--

DROP TABLE IF EXISTS `permission_settings_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_settings_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `permission_settings_id` varchar(45) DEFAULT NULL,
  `permission_allowed` varchar(255) DEFAULT NULL,
  `module_id` varchar(45) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_settings_list`
--

LOCK TABLES `permission_settings_list` WRITE;
/*!40000 ALTER TABLE `permission_settings_list` DISABLE KEYS */;
INSERT INTO `permission_settings_list` VALUES (1,'1','user management','8','active','2025-09-21 05:17:29','2025-09-21 05:30:43','2025-09-21 05:30:43'),(2,'1','vehicle management','10','active','2025-09-21 05:17:29','2025-09-21 05:30:43','2025-09-21 05:30:43'),(3,'2','announcement','13','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(4,'2','appointment management','17','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(5,'2','billing management','14','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(6,'2','billing payment','6','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(7,'2','business management','9','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(8,'2','dashboard','1','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(9,'2','feedback','3','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(10,'2','feedback management','16','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(11,'2','incident management','12','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(12,'2','incident request','5','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(13,'2','message','2','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(14,'2','payment method management','15','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(15,'2','service management','11','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(16,'2','service request','4','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(17,'2','user management','8','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(18,'2','vehicle','7','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(19,'2','vehicle management','10','active','2025-09-21 05:30:29','2025-09-21 05:30:52','2025-09-21 05:30:52'),(20,'2','announcement','13','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(21,'2','appointment management','17','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(22,'2','billing management','14','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(23,'2','billing payment','6','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(24,'2','business management','9','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(25,'2','dashboard','1','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(26,'2','feedback','3','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(27,'2','feedback management','16','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(28,'2','incident management','12','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(29,'2','incident request','5','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(30,'2','message','2','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(31,'2','payment method management','15','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(32,'2','service management','11','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(33,'2','service request','4','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(34,'2','user management','8','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(35,'2','vehicle','7','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(36,'2','vehicle management','10','active','2025-09-21 05:30:52','2025-09-21 05:33:34','2025-09-21 05:33:34'),(37,'2','announcement','13','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(38,'2','appointment management','17','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(39,'2','billing management','14','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(40,'2','billing payment','6','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(41,'2','business management','9','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(42,'2','dashboard','1','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(43,'2','feedback','3','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(44,'2','feedback management','16','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(45,'2','incident management','12','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(46,'2','incident request','5','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(47,'2','message','2','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(48,'2','notification settings','19','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(49,'2','payment account management','15','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(50,'2','Permission Settings','21','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(51,'2','service management','11','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(52,'2','service request','4','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(53,'2','system settings','20','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(54,'2','user management','8','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(55,'2','vehicle','7','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(56,'2','vehicle management','10','active','2025-09-21 05:33:34','2025-10-12 03:01:41','2025-10-12 03:01:41'),(57,'3','announcement','13','active','2025-09-22 12:07:40','2025-10-11 08:59:55','2025-10-11 08:59:55'),(58,'3','announcement','13','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(59,'3','appointment management','17','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(60,'3','billing management','14','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(61,'3','billing payment','6','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(62,'3','business management','9','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(63,'3','dashboard','1','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(64,'3','feedback','3','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(65,'3','feedback management','16','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(66,'3','incident management','12','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(67,'3','incident request','5','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(68,'3','message','2','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(69,'3','notification settings','19','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(70,'3','payment account management','15','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(71,'3','Permission Settings','21','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(72,'3','service management','11','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(73,'3','service request','4','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(74,'3','system settings','20','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(75,'3','user management','8','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(76,'3','vehicle','7','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(77,'3','vehicle management','10','active','2025-10-11 08:59:55','2025-10-11 08:59:55',NULL),(78,'4','incident report','23','active','2025-10-12 02:59:38','2025-10-12 03:01:30','2025-10-12 03:01:30'),(79,'2','announcement','13','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(80,'2','appointment management','17','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(81,'2','billing management','14','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(82,'2','billing payment','6','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(83,'2','business management','9','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(84,'2','dashboard','1','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(85,'2','feedback','3','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(86,'2','feedback management','16','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(87,'2','incident management','12','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(88,'2','incident report','23','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(89,'2','incident request','5','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(90,'2','message','2','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(91,'2','notification settings','19','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(92,'2','payment account management','15','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(93,'2','Permission Settings','21','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(94,'2','service management','11','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(95,'2','service request','4','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(96,'2','system settings','20','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(97,'2','user management','8','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(98,'2','vehicle','7','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL),(99,'2','vehicle management','10','active','2025-10-12 03:01:41','2025-10-12 03:01:41',NULL);
/*!40000 ALTER TABLE `permission_settings_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sticker_control_number`
--

DROP TABLE IF EXISTS `sticker_control_number`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sticker_control_number` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_list_details_homeowners_id` varchar(45) DEFAULT NULL,
  `control_number` varchar(255) DEFAULT NULL,
  `valid_until` date DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sticker_control_number`
--

LOCK TABLES `sticker_control_number` WRITE;
/*!40000 ALTER TABLE `sticker_control_number` DISABLE KEYS */;
INSERT INTO `sticker_control_number` VALUES (2,'2','SCN20259463','2025-10-14','Active','2025-10-12 04:26:20','2025-10-12 04:26:26',NULL),(3,'1','SCN20257804','2025-10-30','Active','2025-10-12 04:33:38','2025-10-12 04:33:42',NULL);
/*!40000 ALTER TABLE `sticker_control_number` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES (1,'login_logo',NULL,'system_settings/1758496846_958f3106-933e-45f6-94d4-16494684712d-modified.png','image','active','2025-09-21 23:11:09','2025-09-21 23:20:46',NULL),(2,'login_top_logo',NULL,'system_settings/1758496906_958f3106-933e-45f6-94d4-16494684712d-modified.png','image','active','2025-09-21 23:11:09','2025-09-21 23:21:46',NULL),(3,'login_top_text',NULL,'Golden Country Homes','text','active','2025-09-21 23:11:09','2025-09-21 23:21:12',NULL),(4,'login_center_text',NULL,'Golden Country Homes','text','active','2025-09-21 23:11:09','2025-09-21 23:21:54',NULL),(5,'login_bottom_text',NULL,'Golden Country Homes','text','active','2025-09-21 23:11:09','2025-09-21 23:22:30',NULL),(6,'topbar_top_logo',NULL,'system_settings/1758497528_958f3106-933e-45f6-94d4-16494684712d-modified.png','image','active','2025-09-21 23:11:09','2025-09-21 23:32:08',NULL),(7,'topbar_top_text',NULL,'Golden Country Homes','text','active','2025-09-21 23:11:09','2025-09-21 23:32:15',NULL);
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_announcement`
--

DROP TABLE IF EXISTS `tbl_announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_announcement` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `visible_to` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_announcement`
--

LOCK TABLES `tbl_announcement` WRITE;
/*!40000 ALTER TABLE `tbl_announcement` DISABLE KEYS */;
INSERT INTO `tbl_announcement` VALUES (1,'vdfvfvdfvdfdvf','dvcvfdvfdvfd','public','Active','2025-10-12 01:10:01','2025-10-12 01:10:01',NULL),(2,'csdcsdcsdcsd','csdcdsscdscd','private','Active','2025-10-12 01:57:34','2025-10-12 01:57:34',NULL),(3,'serfrfeerf','erfrferferfe','public','Active','2025-10-20 12:58:58','2025-10-20 12:58:58',NULL);
/*!40000 ALTER TABLE `tbl_announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_appointment`
--

DROP TABLE IF EXISTS `tbl_appointment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_appointment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `appointment_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tracking_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remarks` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_expired` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_appointment`
--

LOCK TABLES `tbl_appointment` WRITE;
/*!40000 ALTER TABLE `tbl_appointment` DISABLE KEYS */;
INSERT INTO `tbl_appointment` VALUES (1,'Appointment 1','2025-09-01','TRK000001','Remarks 1','completed','1','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(2,'Appointment 2','2025-09-02','TRK000002','Remarks 2','approved','0','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(3,'Appointment 3','2025-09-03','TRK000003','Remarks 3','approved','1','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(4,'Appointment 4','2025-09-04','TRK000004','Remarks 4','approved','0','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(5,'Appointment 5','2025-09-05','TRK000005','Remarks 5','cancelled','1','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(6,'Appointment 6','2025-09-06','TRK000006','Remarks 6','approved','0','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(7,'Appointment 7','2025-09-07','TRK000007','Remarks 7','approved','1','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(8,'Appointment 8','2025-09-08','TRK000008','Remarks 8','completed','0','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(9,'Appointment 9','2025-09-09','TRK000009','Your appointment has been completed successfully','completed','1','2025-08-30 23:43:09','2025-09-21 00:27:11',NULL),(10,'Appointment 10','2025-09-10','TRK000010','Remarks 10','approved','0','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(11,'Appointment 11','2025-09-11','TRK000011','Remarks 11','pending','1','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(12,'Appointment 12','2025-09-12','TRK000012','Remarks 12','pending','0','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(13,'Appointment 13','2025-09-13','TRK000013','Remarks 13','cancelled','1','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(14,'Appointment 14','2025-09-14','TRK000014','Remarks 14','cancelled','0','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(15,'Appointment 15','2025-09-15','TRK000015','Remarks 15','completed','1','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(16,'fdvvfdvdfvdf','2025-10-13T20:22','A-2025-10-13-016','Your appointment is approved and you may now go to office at that time and date that in your appointment','approved','0','2025-10-13 12:22:13','2025-10-20 13:05:33',NULL);
/*!40000 ALTER TABLE `tbl_appointment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_bank_account_category`
--

DROP TABLE IF EXISTS `tbl_bank_account_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_bank_account_category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bank_account_type_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qrcode_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_bank_account_category`
--

LOCK TABLES `tbl_bank_account_category` WRITE;
/*!40000 ALTER TABLE `tbl_bank_account_category` DISABLE KEYS */;
INSERT INTO `tbl_bank_account_category` VALUES (1,'1','Main GCash','09155655576','uploads/qrcodes/1758419951_958f3106-933e-45f6-94d4-16494684712d-modified.png','Active','2025-08-30 23:43:10','2025-09-21 01:59:11',NULL),(2,'2','Main PayMaya','09196864743',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'3','LandBank','31101741',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL);
/*!40000 ALTER TABLE `tbl_bank_account_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_bank_account_type`
--

DROP TABLE IF EXISTS `tbl_bank_account_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_bank_account_type` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_bank_account_type`
--

LOCK TABLES `tbl_bank_account_type` WRITE;
/*!40000 ALTER TABLE `tbl_bank_account_type` DISABLE KEYS */;
INSERT INTO `tbl_bank_account_type` VALUES (1,'GCash','active','2025-08-30 23:43:09','2025-08-30 23:43:09',NULL),(2,'PayMaya','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'Bank','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL);
/*!40000 ALTER TABLE `tbl_bank_account_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_billing_management`
--

DROP TABLE IF EXISTS `tbl_billing_management`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_billing_management` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `billing_date` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `receipt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `official_receipt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount_due` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_account_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_billing_management`
--

LOCK TABLES `tbl_billing_management` WRITE;
/*!40000 ALTER TABLE `tbl_billing_management` DISABLE KEYS */;
INSERT INTO `tbl_billing_management` VALUES (1,'1','20 Oct, 2025 - 20 Nov, 2025','payment_proofs/1760962481_Gemini_Generated_Image_eb9ftkeb9ftkeb9f.png','receipts/official/official_receipt_1_1760962504.html','73','approved','1',NULL,'2025-10-20 12:14:00','2025-10-20 12:43:01',NULL),(2,'1','20 Aug, 2025 - 20 Sep, 2025',NULL,NULL,'55','sent to owners',NULL,NULL,'2025-10-20 12:37:21','2025-10-20 12:37:21',NULL);
/*!40000 ALTER TABLE `tbl_billing_management` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_billing_management_list`
--

DROP TABLE IF EXISTS `tbl_billing_management_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_billing_management_list` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `billing_management_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qty` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_pay` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_billing_management_list`
--

LOCK TABLES `tbl_billing_management_list` WRITE;
/*!40000 ALTER TABLE `tbl_billing_management_list` DISABLE KEYS */;
INSERT INTO `tbl_billing_management_list` VALUES (1,'1','test','1','4','yes','2025-10-20 12:14:00','2025-10-20 12:43:01','2025-10-20 12:43:01'),(2,'1','vdf','1','44','yes','2025-10-20 12:14:00','2025-10-20 12:43:01','2025-10-20 12:43:01'),(3,'2','VFDVFDFVDFVDFVDFVD','1','55','No','2025-10-20 12:37:21','2025-10-20 12:37:21',NULL),(4,'1','test','1','4','No','2025-10-20 12:43:01','2025-10-20 12:43:01',NULL),(5,'1','vdf','1','44','No','2025-10-20 12:43:01','2025-10-20 12:43:01',NULL),(6,'1','RFBGGBBFG','5','5','No','2025-10-20 12:43:01','2025-10-20 12:43:01',NULL);
/*!40000 ALTER TABLE `tbl_billing_management_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_feedback`
--

DROP TABLE IF EXISTS `tbl_feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_feedback` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `rating` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_feedback`
--

LOCK TABLES `tbl_feedback` WRITE;
/*!40000 ALTER TABLE `tbl_feedback` DISABLE KEYS */;
INSERT INTO `tbl_feedback` VALUES (1,'1','Feedback 1','5','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(2,'2','Feedback 2','4','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'3','Feedback 3','1','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(4,'4','Feedback 4','5','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(5,'5','Feedback 5','3','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(6,'6','Feedback 6','5','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(7,'7','Feedback 7','5','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(8,'8','Feedback 8','5','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(9,'9','Feedback 9','3','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(10,'10','Feedback 10','1','visible','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(11,'1','csdcsdscdscd','5','active','2025-10-11 09:44:00','2025-10-11 09:44:00',NULL),(12,'1','xxxxxxxxxxxxxxxx','1','active','2025-10-11 09:44:06','2025-10-11 09:55:34',NULL),(13,'1','csdcsdsdc','3','active','2025-10-11 09:44:11','2025-10-11 09:44:11',NULL),(14,'1','scdcsdsdcscd','1','active','2025-10-11 09:44:16','2025-10-11 09:44:16',NULL),(15,'1','scdcsdcsdsdc','2','active','2025-10-11 09:44:22','2025-10-11 09:44:22',NULL),(16,'1','csdscdcsd','3','active','2025-10-11 09:44:28','2025-10-11 09:44:28',NULL),(17,'1','cdscdscsdscd','5','active','2025-10-11 09:44:34','2025-10-11 09:44:34',NULL),(18,'1','vdfvdfdfvdvf','1','active','2025-10-11 09:44:39','2025-10-11 09:44:39',NULL),(19,'1','vdfvdfdvfdvf','2','active','2025-10-11 09:44:46','2025-10-11 09:44:46',NULL),(20,'1','vdffvdfvdfvd','2','active','2025-10-11 09:44:53','2025-10-11 09:44:53',NULL),(21,'1','vdffvddvf','2','active','2025-10-11 09:54:08','2025-10-11 09:54:08',NULL),(22,'1','ADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)Lagyan ng parang Floating Chat (parang y','4','active','2025-10-11 10:24:52','2025-10-11 10:24:52',NULL),(23,'1','ADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location…\r\n\r\nVehicle\r\nFilter doesn’t work\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin.\r\nyung business management ay magiging establishment management (so change name lang po)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information \r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words)\r\nThere should be optional (in Service Types)\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang acco\r\nADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location…\r\n\r\nVehicle\r\nFilter doesn’t work\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin.\r\nyung business management ay magiging establishment management (so change name lang po)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information \r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words)\r\nThere should be optional (in Service Types)\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang account \r\n\r\nADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location…\r\n\r\nVehicle\r\nFilter doesn’t work\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin.\r\nyung business management ay magiging establishment management (so change name lang po)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information \r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words)\r\nThere should be optional (in Service Types)\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang account','4','active','2025-10-11 10:31:42','2025-10-11 10:32:01',NULL),(24,'1','vvvv','1','active','2025-10-20 14:35:12','2025-10-20 14:35:12',NULL);
/*!40000 ALTER TABLE `tbl_feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_incident_report`
--

DROP TABLE IF EXISTS `tbl_incident_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_incident_report` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `person_involved_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `datetime_of_incident` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location_of_incident` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `guard_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_incident_report`
--

LOCK TABLES `tbl_incident_report` WRITE;
/*!40000 ALTER TABLE `tbl_incident_report` DISABLE KEYS */;
INSERT INTO `tbl_incident_report` VALUES (1,'2025-08-30 23:43:10','2025-08-30 23:43:10','1','Person 1','Address 1','Resident','2025-08-30 07:43:10','Gate 1','1','Test reason','open',NULL),(2,'2025-08-30 23:43:10','2025-08-30 23:43:10','2','Person 2','Address 2','Resident','2025-08-29 07:43:10','Gate 2','1','Test reason','open',NULL),(3,'2025-08-30 23:43:10','2025-08-30 23:43:10','3','Person 3','Address 3','Resident','2025-08-28 07:43:10','Gate 3','2','Test reason','open',NULL),(4,'2025-08-30 23:43:10','2025-08-30 23:43:10','4','Person 4','Address 4','Resident','2025-08-27 07:43:10','Gate 4','3','Test reason','open',NULL),(5,'2025-08-30 23:43:10','2025-08-30 23:43:10','5','Person 5','Address 5','Resident','2025-08-26 07:43:10','Gate 5','4','Test reason','open',NULL),(6,'2025-08-30 23:43:10','2025-08-30 23:43:10','6','Person 6','Address 6','Resident','2025-08-25 07:43:10','Gate 6','5','Test reason','open',NULL),(7,'2025-08-30 23:43:10','2025-08-30 23:43:10','7','Person 7','Address 7','Resident','2025-08-24 07:43:10','Gate 7','6','Test reason','open',NULL),(8,'2025-08-30 23:43:10','2025-08-30 23:43:10','8','Person 8','Address 8','Resident','2025-08-23 07:43:10','Gate 8','7','Test reason','open',NULL),(9,'2025-10-20 12:51:24','2025-10-20 12:51:24','1','vfdfdvvfd','vfdvfdvfd','vfdvfdvfd','2025-10-20T20:51','dvfcvfddvfvdf','3',NULL,'Pending',NULL),(10,'2025-10-20 12:51:46','2025-10-20 12:51:46','1','vfdvfdfvd','fvdvfdfvdfvd','vfdfvdvfd','2025-10-20T16:51','fvdvdfvfdvfd','3',NULL,'Pending',NULL),(11,'2025-10-20 12:52:02','2025-10-20 12:52:02','1','csdcsdscd','scdscdscd','scdscdscd','2025-10-20T15:51','vfvfdfvdvdfvdf','3',NULL,'Pending',NULL);
/*!40000 ALTER TABLE `tbl_incident_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_otp`
--

DROP TABLE IF EXISTS `tbl_otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_otp` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_code` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expire_at` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_otp`
--

LOCK TABLES `tbl_otp` WRITE;
/*!40000 ALTER TABLE `tbl_otp` DISABLE KEYS */;
INSERT INTO `tbl_otp` VALUES (1,'1','user1@example.com','759368','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(2,'2','user2@example.com','440039','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'3','user3@example.com','594987','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(4,'4','user4@example.com','371888','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(5,'5','user5@example.com','663819','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(6,'6','user6@example.com','572853','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(7,'7','user7@example.com','618081','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(8,'8','user8@example.com','349851','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(9,'9','user9@example.com','299587','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(10,'10','user10@example.com','154534','not_used','2025-08-31 07:53:10','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(11,'1','dennisbongaitan18@gmail.com','471735','not_used','2025-10-18 16:44:05','2025-10-18 08:34:05','2025-10-18 08:34:05',NULL),(12,'1','dennisbongaitan18@gmail.com','736417','not_used','2025-10-18 16:48:49','2025-10-18 08:38:49','2025-10-18 08:38:49',NULL),(13,'1','dennisbongaitan18@gmail.com','674582','used','2025-10-18 16:51:01','2025-10-18 08:41:01','2025-10-18 08:41:27',NULL),(14,'2','d@gmail.com','691095','used','2025-10-20 20:29:56','2025-10-20 12:19:56','2025-10-20 12:21:45',NULL),(15,'3','clzmiles@gmail.com','273292','used','2025-10-20 21:00:08','2025-10-20 12:50:08','2025-10-20 12:50:29',NULL);
/*!40000 ALTER TABLE `tbl_otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_service_management_category`
--

DROP TABLE IF EXISTS `tbl_service_management_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_service_management_category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `service_management_type_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_service_management_category`
--

LOCK TABLES `tbl_service_management_category` WRITE;
/*!40000 ALTER TABLE `tbl_service_management_category` DISABLE KEYS */;
INSERT INTO `tbl_service_management_category` VALUES (1,'1','Electrical','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(2,'1','Plumbing','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'2','Patrol','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL);
/*!40000 ALTER TABLE `tbl_service_management_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_service_management_complaints`
--

DROP TABLE IF EXISTS `tbl_service_management_complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_service_management_complaints` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `service_management_category_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `complaint_description` longtext COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_service_management_complaints`
--

LOCK TABLES `tbl_service_management_complaints` WRITE;
/*!40000 ALTER TABLE `tbl_service_management_complaints` DISABLE KEYS */;
INSERT INTO `tbl_service_management_complaints` VALUES (1,'1','1','Complaint desc 1','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(2,'3','2','Complaint desc 2','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'2','3','Complaint desc 3','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(4,'2','4','Complaint desc 4','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(5,'1','5','Complaint desc 5','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(6,'3','6','Complaint desc 6','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(7,'3','7','Complaint desc 7','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(8,'1','8','Complaint desc 8','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(9,'2','9','Complaint desc 9','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(10,'3','10','Complaint desc 10','open',NULL,'2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(11,'3','1','vfgvgfbgfg','Approved',NULL,'2025-09-22 00:11:29','2025-09-22 00:14:43',NULL),(12,'2','1','ADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location… (done)\r\n\r\nVehicle\r\nFilter doesn’t work (done)\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user (done)\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected (done)\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time (done new features to iniadd ko nalang to)\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin. ( note: kaya may notification settings yan para sya yong makakatanggap ng notification from homeowners at non homeowners. example : pag mag apply ako ng business dapat yong makakatanggap lang ng application ko or data ko yong autorize lang na na set doon sa notification settings. Yong notification settings is for admin, kumbaga exclusive lang sa employee ng company sino nag checheck per data hindi naman kasali yong user nyan automatic naman sa user)\r\nyung business management ay magiging establishment management (so change name lang po) (DONE)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information\r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.) ( (note: ano to gagawan ng registration for non homeowners)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words) (NEW FEATURES NOT DONE)\r\nThere should be optional (in Service Types) ( HA ? ANO ? )\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang account','Pending',NULL,'2025-10-12 01:50:14','2025-10-12 01:50:14',NULL),(13,'1','1','ADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location… (done)\r\n\r\nVehicle\r\nFilter doesn’t work (done)\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user (done)\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected (done)\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time (done new features to iniadd ko nalang to)\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin. ( note: kaya may notification settings yan para sya yong makakatanggap ng notification from homeowners at non homeowners. example : pag mag apply ako ng business dapat yong makakatanggap lang ng application ko or data ko yong autorize lang na na set doon sa notification settings. Yong notification settings is for admin, kumbaga exclusive lang sa employee ng company sino nag checheck per data hindi naman kasali yong user nyan automatic naman sa user)\r\nyung business management ay magiging establishment management (so change name lang po) (DONE)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information\r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.) ( (note: ano to gagawan ng registration for non homeowners)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words) (NEW FEATURES NOT DONE)\r\nThere should be optional (in Service Types) ( HA ? ANO ? )\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang account','Pending',NULL,'2025-10-12 01:56:40','2025-10-12 01:56:40',NULL),(14,'3','1','ADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location… (done)\r\n\r\nVehicle\r\nFilter doesn’t work (done)\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user (done)\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected (done)\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time (done new features to iniadd ko nalang to)\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin. ( note: kaya may notification settings yan para sya yong makakatanggap ng notification from homeowners at non homeowners. example : pag mag apply ako ng business dapat yong makakatanggap lang ng application ko or data ko yong autorize lang na na set doon sa notification settings. Yong notification settings is for admin, kumbaga exclusive lang sa employee ng company sino nag checheck per data hindi naman kasali yong user nyan automatic naman sa user)\r\nyung business management ay magiging establishment management (so change name lang po) (DONE)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information\r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.) ( (note: ano to gagawan ng registration for non homeowners)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words) (NEW FEATURES NOT DONE)\r\nThere should be optional (in Service Types) ( HA ? ANO ? )\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang account','Pending',NULL,'2025-10-12 01:56:49','2025-10-12 01:56:49',NULL),(15,'1','1','ADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location… (done)\r\n\r\nVehicle\r\nFilter doesn’t work (done)\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user (done)\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected (done)\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time (done new features to iniadd ko nalang to)\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin. ( note: kaya may notification settings yan para sya yong makakatanggap ng notification from homeowners at non homeowners. example : pag mag apply ako ng business dapat yong makakatanggap lang ng application ko or data ko yong autorize lang na na set doon sa notification settings. Yong notification settings is for admin, kumbaga exclusive lang sa employee ng company sino nag checheck per data hindi naman kasali yong user nyan automatic naman sa user)\r\nyung business management ay magiging establishment management (so change name lang po) (DONE)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information\r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.) ( (note: ano to gagawan ng registration for non homeowners)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words) (NEW FEATURES NOT DONE)\r\nThere should be optional (in Service Types) ( HA ? ANO ? )\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang account','Pending',NULL,'2025-10-12 01:57:01','2025-10-12 01:57:01',NULL),(16,'1','1','ADMIN\r\nMedyo mabagal yung loading pag naglogin or if pupunta kada page (which is sala sa non-functional requirements)\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\nMaglagay ng banned words sa feedback, complaint, service request, etc.\r\nAdd more strict authentication protocols\r\nThe data can be backup \r\nWhen homeowner leave the GCH, they will be non-homeowner and can’t access their account and their account will appear in the system of Admin and can be archived\r\nStrong encryption algorithms will be used for storing user passwords. \r\nDashboard – alisin na yung drop down sa dashboard (done)\r\nNotifications – hindi nacliclick yung each notif and hindi nagana yung “View All Notification”\r\nMessage\r\nDifferent layout\r\nPag naghome yung previous messages doesn’t appear sa side like nawawala need pa i-search (need pa i-saved yung star)\r\nPag may nagmessage walang notif na nalabas sa admin or sa user (done) \r\nLagyan ng parang Floating Chat (parang yung sa Facebook if naka-web) ( new features )\r\nFeedback Management\r\n‘Search’ doesn’t work\r\nAdd Filter by rating, user, status, date \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nService Management\r\nAdd filter by Homeowner (A-Z or Z-A), Date, Status) (kahit nagana na yung search)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\nBilling Management\r\nSira yung layout \r\nInstead na select user, add user (not dropdown)\r\nWhen ‘View’ is clicked yung format ay gulo\r\nAdd a Alert button if lampas na sa Due date (and if lagpas yung user sa due date ay automatically may alert, yung Alert button ay nandon if lagpas na for days, months)\r\nWhen approved the receipt disappear\r\nWhen approved maggegenerate sya ng receipt about sa payment which is marerecieve ni user (na magstotore sa user, na downloadable) \r\nFilter by Status, Date, Homeowner (A-Z or Z-A)\r\nYung payment method (is yung Gcash, Maya, etc…)\r\nYung approved status dapat pwede paltan incase na nagkamali si Admin sa pagclick\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nIncident Management\r\nThe table layout is ruined \r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nFilter by Status, date, location… (done)\r\n\r\nVehicle\r\nFilter doesn’t work (done)\r\nBusiness Management\r\nMake the address column much wider\r\nWhen approved it doesn’t send notification to the user (done)\r\nAnnouncement Management\r\n‘Visible to’ – ‘Private’ and ‘Public’ mas okay if mas if much direct yung wordings (kasi nothing appears to user when ‘Private’ is selected (done)\r\nAnd if user pic ‘Public’ add kung gaano katalagal sya naka-posted, so mas okay lagyan ng date and time (done new features to iniadd ko nalang to)\r\n\r\nNotification Settings\r\nSa ‘User’ mas okay if hindi isa-isa na user like pang buong Homeowners na kasi mahirap pag-isaisa mo lalagyan ang mga homeowners (like ang options much better if: Homeowner, Non-Homeowner, Landlord, and yung mga iba’t ibang admin. ( note: kaya may notification settings yan para sya yong makakatanggap ng notification from homeowners at non homeowners. example : pag mag apply ako ng business dapat yong makakatanggap lang ng application ko or data ko yong autorize lang na na set doon sa notification settings. Yong notification settings is for admin, kumbaga exclusive lang sa employee ng company sino nag checheck per data hindi naman kasali yong user nyan automatic naman sa user)\r\nyung business management ay magiging establishment management (so change name lang po) (DONE)\r\n\r\nUSERS\r\nIlagay yung appointment sa loob ng system hindi sa login,  yung appointment ay yung magiging facility booking for homeowners only\r\nSo yung Appointment Management ay magiging about sa facility booking and vehicle sticker (tas admin view po ay may calendar nung sched sa araw na yun)\r\n\r\nNeed talaga may Non-Homeowner account kahit vehicle, chatbot lang yung kanila (kasi yun ang nasa manuscript)\r\nNeed po nila mag-create ng account by using gmail, and necessary information then hindi agad sila makaka-login kasi need i-approve ni admin\r\nThe non-homeowner will be able to view the profile information and will be able to update the personal information\r\nNon-homeowners will be able to apply for vehicle sticker registration and  will be able to view the status of the vehicle sticker registration\r\nNon-homeowners will be able to interact with the chatbot for information and assistance. \r\nNon-homeowners will be able to view the status of the registration in the announcements. (if open yung gch etc.) ( (note: ano to gagawan ng registration for non homeowners)\r\n\r\nFeedback\r\nMuch better if yung message na if hindi nagclick ng stars yung users and nagsubmit, yung message ay nasa mismong box\r\nWhen ‘View’ is clicked, sira yung layout\r\nThe ‘edit’ doesn’t work may message lang na “You can only edit your feedback” kahit yung user mismo ang nagedit nung prev feedback nya\r\nYung search ay nagana lang if ang sinearch mo ay “User Name”, much okay if yung mismong mga words na present sa feedback nila yung lalabas \r\nAnd yung ‘Feedback’ sa table mas okay na wala sya sa mismong table pero if yung ‘View’ is clicked dun sya lalabas kasi may mga maiikli na description at hindi \r\nNageerror if madaming words yung description\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right) (done)\r\n\r\nService Request\r\nWhen ‘Request Service’ is clicked, it can’t be closed\r\nWhen you search something, it highlight the words natina-type (like if you type “Plumbing” may yellow na nakahighlight mismo dun po sa words) (NEW FEATURES NOT DONE)\r\nThere should be optional (in Service Types) ( HA ? ANO ? )\r\nLong Description type, mag-eerror\r\nWhen new request is added, it doesn’t appear (need to be reloaded)\r\nUtilities doesn’t work \r\nShould have filter for service types, category, status, date\r\nYou can only search the whole page except the ‘Service Types’\r\nSearch should be for the whole page (including the ‘Service Types’ even description, in case someone search using keyword)\r\nThe ‘next page’ function is hindi nagana, same as the ‘Entries’ available in one page (yung nasa bottom right)\r\nTas sa Service request: sa Request Service gawing:  Maintenance \r\n\r\nVehicle \r\nMas okay if pwede kahit ilang docs and pwede ilagay \r\n\r\nIncident Report\r\nWala sa system yung incident report \r\n\r\nLandlords interact with the system by providing Tenant Data—which include tenant details, lease agreements, and business permits, and will receive reports related to tenants and establishments.\r\nThey must submit lease agreements and business permits\r\n\r\nSecurity Personnel will contribute in e.g. service maintenance request, complaint, and incident reports by receiving and having the capability to update the status of these reports and address homeowner concerns. \r\n\r\nLandlord Application Management will allow homeowners to submit applications to the HOA to obtain approval for renting out the properties within the community. The HOA will be able to review, process, approve/reject, and manage these landlord applications, ensuring compliance with community regulations.\r\nI. Personal Information\r\nFull Name (First, Last, Middle Initial)\r\nDate of Birth:\r\nAddress:\r\nCivil Status:\r\nNationality:\r\nEmail:\r\nPhone Number:\r\nYears of residency:\r\nII. Property Information\r\nProperty Name/Building:\r\nUnit/Lot/House Number:\r\nComplete Property Address:\r\nUnit Type (e.g., Condo, House & Lot, Apartment):\r\nFloor Area (SqM):\r\nUnit Condition: Fully Furnished □ Semi-Furnished □ Unfurnished Optional:_____\r\nthey can upload file (pero make it optional po muna)\r\nAfter na-approve ni admin si landlord application ay isesend si admin na business clearance file \r\nKahit ilang file pwede i-upload nila both (for future changes)\r\n\r\nChatbot– can be accessed by Homeowner, Non-Homeowner, and Landlord\r\nchatbot (yung may option na automated messages ta pwede parin ichat ng admin)\r\n\r\nYung tenant sa profile is pwede lang if landlord lang yung may access\r\n\r\nLagyan ng disable at enable lahat ng functions (kahit yung tenant sa profile function) na controlled ng admin\r\n\r\nKaya po need talaga tagtagin yung appointment sa login ay kasi po what will happen if the GCH closes for half a day because of an emergency, hindi po makakapagsend ng message si admin about sa emergency lalo po wala silang account','Pending',NULL,'2025-10-12 02:00:53','2025-10-12 02:00:53',NULL),(17,'2','1','<!-- Service Type Filter -->\r\n        <div class=\"dropdown\">\r\n            <button class=\"dropdown-toggle btn btn-outline-secondary\" aria-expanded=\"false\" data-tw-toggle=\"dropdown\" id=\"serviceTypeFilterBtn\">\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4 mr-2\">\r\n                    <polygon points=\"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3\"></polygon>\r\n                </svg>\r\n                Service Type: All\r\n            </button>\r\n            <div class=\"dropdown-menu w-48\">\r\n                <ul class=\"dropdown-content overflow-y-auto max-h-64\">\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"service-type\" data-filter-value=\"all\">All Types</a></li>\r\n                    @foreach($serviceTypes as $type)\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"service-type\" data-filter-value=\"{{ $type->type }}\">{{ $type->type }}</a></li>\r\n                    @endforeach\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Category Filter -->\r\n        <div class=\"dropdown\">\r\n            <button class=\"dropdown-toggle btn btn-outline-secondary\" aria-expanded=\"false\" data-tw-toggle=\"dropdown\" id=\"categoryFilterBtn\">\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4 mr-2\">\r\n                    <line x1=\"8\" y1=\"6\" x2=\"21\" y2=\"6\"></line>\r\n                    <line x1=\"8\" y1=\"12\" x2=\"21\" y2=\"12\"></line>\r\n                    <line x1=\"8\" y1=\"18\" x2=\"21\" y2=\"18\"></line>\r\n                    <line x1=\"3\" y1=\"6\" x2=\"3.01\" y2=\"6\"></line>\r\n                    <line x1=\"3\" y1=\"12\" x2=\"3.01\" y2=\"12\"></line>\r\n                    <line x1=\"3\" y1=\"18\" x2=\"3.01\" y2=\"18\"></line>\r\n                </svg>\r\n                Category: All\r\n            </button>\r\n            <div class=\"dropdown-menu w-48\">\r\n                <ul class=\"dropdown-content overflow-y-auto max-h-64\">\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"category\" data-filter-value=\"all\">All Categories</a></li>\r\n                    @foreach($categories as $category)\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"category\" data-filter-value=\"{{ $category->category }}\">{{ $category->category }}</a></li>\r\n                    @endforeach\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Status Filter -->\r\n        <div class=\"dropdown\">\r\n            <button class=\"dropdown-toggle btn btn-outline-secondary\" aria-expanded=\"false\" data-tw-toggle=\"dropdown\" id=\"statusFilterBtn\">\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4 mr-2\">\r\n                    <circle cx=\"12\" cy=\"12\" r=\"10\"></circle>\r\n                    <path d=\"M12 6v6l4 2\"></path>\r\n                </svg>\r\n                Status: All\r\n            </button>\r\n            <div class=\"dropdown-menu w-40\">\r\n                <ul class=\"dropdown-content\">\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"status\" data-filter-value=\"all\">All Status</a></li>\r\n                    @foreach($statuses as $status)\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"status\" data-filter-value=\"{{ $status }}\">{{ ucfirst($status) }}</a></li>\r\n                    @endforeach\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Filter by Date -->\r\n        <div class=\"dropdown\">\r\n            <button class=\"dropdown-toggle btn btn-outline-secondary\" aria-expanded=\"false\" data-tw-toggle=\"dropdown\" id=\"dateFilterBtn\">\r\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4 mr-2\">\r\n                    <rect x=\"3\" y=\"4\" width=\"18\" height=\"18\" rx=\"2\" ry=\"2\"></rect>\r\n                    <line x1=\"16\" y1=\"2\" x2=\"16\" y2=\"6\"></line>\r\n                    <line x1=\"8\" y1=\"2\" x2=\"8\" y2=\"6\"></line>\r\n                    <line x1=\"3\" y1=\"10\" x2=\"21\" y2=\"10\"></line>\r\n                </svg>\r\n                Filter by Date\r\n            </button>\r\n            <div class=\"dropdown-menu w-40\">\r\n                <ul class=\"dropdown-content\">\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"date-filter\" data-filter-value=\"all\">All Dates</a></li>\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"date-filter\" data-filter-value=\"today\">Today</a></li>\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"date-filter\" data-filter-value=\"yesterday\">Yesterday</a></li>\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"date-filter\" data-filter-value=\"this-week\">This Week</a></li>\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"date-filter\" data-filter-value=\"last-week\">Last Week</a></li>\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"date-filter\" data-filter-value=\"this-month\">This Month</a></li>\r\n                    <li><a href=\"javascript:;\" class=\"dropdown-item\" data-filter-type=\"date-filter\" data-filter-value=\"last-month\">Last Month</a></li>\r\n                </ul>\r\n            </div>\r\n        </div>\r\n\r\n        <!-- Reset Filters Button -->\r\n        <button type=\"button\" class=\"btn btn-outline-danger\" id=\"resetFiltersBtn\">\r\n            <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"16\" height=\"16\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"w-4 h-4 mr-2\">\r\n                <polyline points=\"1 4 1 10 7 10\"></polyline>\r\n                <polyline points=\"23 20 23 14 17 14\"></polyline>\r\n                <path d=\"M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15\"></path>\r\n            </svg>\r\n            Reset\r\n        </button>','Pending',NULL,'2025-10-12 02:52:11','2025-10-12 02:52:11',NULL);
/*!40000 ALTER TABLE `tbl_service_management_complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_service_management_type`
--

DROP TABLE IF EXISTS `tbl_service_management_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_service_management_type` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_service_management_type`
--

LOCK TABLES `tbl_service_management_type` WRITE;
/*!40000 ALTER TABLE `tbl_service_management_type` DISABLE KEYS */;
INSERT INTO `tbl_service_management_type` VALUES (1,'Maintenance','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(2,'Security','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'Utilities','active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL);
/*!40000 ALTER TABLE `tbl_service_management_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_tenant_list`
--

DROP TABLE IF EXISTS `tbl_tenant_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_tenant_list` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relationship` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_tenant_list`
--

LOCK TABLES `tbl_tenant_list` WRITE;
/*!40000 ALTER TABLE `tbl_tenant_list` DISABLE KEYS */;
INSERT INTO `tbl_tenant_list` VALUES (1,'1','Tenant 1','Family','+12917259048','tenant1@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(2,'2','Tenant 2','Family','+13078063544','tenant2@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(3,'3','Tenant 3','Family','+14227385826','tenant3@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(4,'4','Tenant 4','Family','+17602717943','tenant4@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(5,'5','Tenant 5','Family','+18483336886','tenant5@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(6,'6','Tenant 6','Family','+17039031521','tenant6@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(7,'7','Tenant 7','Family','+11315265182','tenant7@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(8,'8','Tenant 8','Family','+19250603112','tenant8@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(9,'9','Tenant 9','Family','+19674642372','tenant9@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(10,'10','Tenant 10','Family','+13790235356','tenant10@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(11,'11','Tenant 11','Family','+18693684090','tenant11@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL),(12,'12','Tenant 12','Family','+12450153523','tenant12@example.com',NULL,'active','2025-08-30 23:43:10','2025-08-30 23:43:10',NULL);
/*!40000 ALTER TABLE `tbl_tenant_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_vehicle_homeowners`
--

DROP TABLE IF EXISTS `tbl_vehicle_homeowners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_vehicle_homeowners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_of_vehicle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_vehicle_homeowners`
--

LOCK TABLES `tbl_vehicle_homeowners` WRITE;
/*!40000 ALTER TABLE `tbl_vehicle_homeowners` DISABLE KEYS */;
INSERT INTO `tbl_vehicle_homeowners` VALUES (1,'1','car','Approved','2025-10-12 03:19:52','2025-10-12 04:33:38',NULL),(2,'1','motorcycle','Approved','2025-10-12 03:27:14','2025-10-12 04:26:20',NULL),(3,'1','car','Pending','2025-10-20 12:54:51','2025-10-20 12:54:51',NULL);
/*!40000 ALTER TABLE `tbl_vehicle_homeowners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_vehicle_homeowners_supporting_documents`
--

DROP TABLE IF EXISTS `tbl_vehicle_homeowners_supporting_documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_vehicle_homeowners_supporting_documents` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_homeowners_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `supporting_documents_attachments` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_vehicle_homeowners_supporting_documents`
--

LOCK TABLES `tbl_vehicle_homeowners_supporting_documents` WRITE;
/*!40000 ALTER TABLE `tbl_vehicle_homeowners_supporting_documents` DISABLE KEYS */;
INSERT INTO `tbl_vehicle_homeowners_supporting_documents` VALUES (1,'1','[\"vehicle_documents\\/1760239192_68eb1e58e1dea_482349334_1157297672764892_1296471932904069408_n-modified.png\",\"vehicle_documents\\/1760239192_68eb1e58e2ade_bayabas.png\"]','Approved','2025-10-12 03:19:52','2025-10-12 04:33:38',NULL),(2,'2','[\"vehicle_documents\\/1760239634_68eb2012d026a_527231568_732858389534181_6241228450351103595_n-removebg-preview.png\",\"vehicle_documents\\/1760239634_68eb2012d140e_logo.png\"]','Approved','2025-10-12 03:27:14','2025-10-12 04:26:20',NULL),(3,'3','[\"vehicle_documents\\/1760964891_68f6311b1b36e_Gemini_Generated_Image_eb9ftkeb9ftkeb9f.png\",\"vehicle_documents\\/1760964891_68f6311b1c9b8_482349334_1157297672764892_1296471932904069408_n.jpg\"]','Pending','2025-10-20 12:54:51','2025-10-20 12:54:51',NULL);
/*!40000 ALTER TABLE `tbl_vehicle_homeowners_supporting_documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_vehicle_list_details_homeowners`
--

DROP TABLE IF EXISTS `tbl_vehicle_list_details_homeowners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_vehicle_list_details_homeowners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_homeowners_supporting_documents_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plate_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `or_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehicle_model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cr_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color_of_vehicle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehicle_sticker_control_no` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` longtext COLLATE utf8mb4_unicode_ci,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_vehicle_list_details_homeowners`
--

LOCK TABLES `tbl_vehicle_list_details_homeowners` WRITE;
/*!40000 ALTER TABLE `tbl_vehicle_list_details_homeowners` DISABLE KEYS */;
INSERT INTO `tbl_vehicle_list_details_homeowners` VALUES (1,'1','vfd','vdf','vfd','vdf','vvdf','3',NULL,'Approved','2025-10-12 03:19:52','2025-10-12 04:33:38',NULL),(2,'2','vfdvdfvdffvdvfd','vfdvfdvfd','vfdvfdvfd','vdffvddvf','fvdvdfvdf','2',NULL,'Approved','2025-10-12 03:27:14','2025-10-12 04:26:20',NULL),(3,'3','545444444','vdfvfvd','vdfvfdvdf','vfdvfdvfd','vdvdffd',NULL,NULL,'Pending','2025-10-20 12:54:51','2025-10-20 12:54:51',NULL);
/*!40000 ALTER TABLE `tbl_vehicle_list_details_homeowners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lot` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `block` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `membership_fee` decimal(10,2) DEFAULT NULL,
  `is_with_title` tinyint(1) DEFAULT '0',
  `gender` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `active` tinyint(1) DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active_status` tinyint(1) DEFAULT '0',
  `avatar` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'avatar.png',
  `dark_mode` tinyint(1) DEFAULT '0',
  `messenger_color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_of_birth` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `civil_status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number_of_months_stay` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telephone_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fb_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `messenger_account` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `prepared_contact` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caretaker_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caretaker_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caretaker_contact_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caretaker_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `signature_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `incase_of_emergency` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_online` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'aaaa',NULL,NULL,NULL,NULL,NULL,0,'male','dennisbongaitan18@gmail.com','2025-08-29 15:39:54','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','1760181252_1.jpg','admin',1,NULL,0,'avatar.png',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'signature_1760181226_1.jpg',NULL,'1',NULL,'2025-10-20 14:08:41',NULL),(2,'bobo',NULL,NULL,NULL,NULL,NULL,0,'female','d@gmail.com','2025-08-29 15:39:54','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',NULL,'user',1,NULL,0,'avatar.png',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'1',NULL,'2025-10-20 14:20:15',NULL),(3,'bfg','Davao City','scd','4','434343',0.00,1,'male','clzmiles@gmail.com',NULL,'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','1758542300_KGvMXl5t.png','guard',1,NULL,0,'avatar.png',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'0','2025-09-22 11:58:20','2025-10-20 13:10:16',NULL),(4,'bfgbgf',NULL,NULL,NULL,'5445544554',NULL,0,'Male','egoogank@gmail.com',NULL,'$2y$10$JtLpcOQs0dir3Po0KQrot.89eU5Zghlr7TUvB7CZ0WhlDvjT77E6e','1760968256_68f63e40b0961.png','non_homeowners',1,NULL,0,'avatar.png',0,NULL,'2025-10-20','Married',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-20 13:50:56','2025-10-20 14:08:23',NULL),(5,'cszdcsdsdccsdcsd',NULL,NULL,NULL,'4544545',NULL,0,'Female','a@gmail.com',NULL,'$2y$10$Fo7nEWyPr6Xk/O34w3/SeeFQCeu86/ojFJYWV3frmYsLH8jLTMwsK','1760968296_68f63e68b2c02.png','non_homeowners',1,NULL,0,'avatar.png',0,NULL,'2025-10-20','Divorced',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-20 13:51:36','2025-10-20 14:08:23',NULL),(6,'csx csscdcdsscdsc',NULL,NULL,NULL,'129',NULL,0,'Male','midone@left4code.com',NULL,'$2y$10$Pa/FLL297FbiS2J564IddOnSs2tyCOEDlOFMmMIZZGoq.1tdIB8Se','1760968553_68f63f698e8ed.png','non_homeowners',1,NULL,0,'avatar.png',0,NULL,'2025-10-20','Single',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-10-20 13:55:53','2025-10-20 14:08:24',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_login`
--

DROP TABLE IF EXISTS `users_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` varchar(255) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `mac_address` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 ;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_login`
--

LOCK TABLES `users_login` WRITE;
/*!40000 ALTER TABLE `users_login` DISABLE KEYS */;
INSERT INTO `users_login` VALUES (1,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-18 08:41:27','2025-10-18 08:41:27',NULL),(2,'1','Chrome 141.0.0.0 on Windows 10','127.0.0.1','N/A','Local Network','logout','2025-10-18 08:42:08','2025-10-18 08:42:08',NULL),(3,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-18 08:44:45','2025-10-18 08:44:45',NULL),(4,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-18 08:44:59','2025-10-18 08:44:59',NULL),(5,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-18 09:05:09','2025-10-18 09:05:09',NULL),(6,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-18 23:27:22','2025-10-18 23:27:22',NULL),(7,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-19 05:58:09','2025-10-19 05:58:09',NULL),(8,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-19 10:47:58','2025-10-19 10:47:58',NULL),(9,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-19 10:49:16','2025-10-19 10:49:16',NULL),(10,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 12:10:10','2025-10-20 12:10:10',NULL),(11,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 12:19:49','2025-10-20 12:19:49',NULL),(12,'2','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 12:21:46','2025-10-20 12:21:46',NULL),(13,'2','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 12:22:42','2025-10-20 12:22:42',NULL),(14,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 12:22:48','2025-10-20 12:22:48',NULL),(15,'3','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 12:50:30','2025-10-20 12:50:30',NULL),(16,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 13:06:38','2025-10-20 13:06:38',NULL),(17,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 13:07:02','2025-10-20 13:07:02',NULL),(18,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 13:07:44','2025-10-20 13:07:44',NULL),(19,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 13:08:00','2025-10-20 13:08:00',NULL),(20,'3','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 13:10:16','2025-10-20 13:10:16',NULL),(21,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 13:12:38','2025-10-20 13:12:38',NULL),(22,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 13:19:34','2025-10-20 13:19:34',NULL),(23,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 13:47:53','2025-10-20 13:47:53',NULL),(24,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 13:56:11','2025-10-20 13:56:11',NULL),(25,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','logout','2025-10-20 14:08:35','2025-10-20 14:08:35',NULL),(26,'1','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 14:08:41','2025-10-20 14:08:41',NULL),(27,'2','Chrome 141.0.0.0 on Windows 10','210.1.107.2','DEVICE-00:00:41:B0:E9:54','Davao City, Davao Region, Philippines','login','2025-10-20 14:20:16','2025-10-20 14:20:16',NULL);
/*!40000 ALTER TABLE `users_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_details`
--

DROP TABLE IF EXISTS `vehicle_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `vehicle_management_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `plate_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `or_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cr_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vehicle_model` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `color` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sticker_control_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_details_vehicle_management_id_foreign` (`vehicle_management_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_details`
--

LOCK TABLES `vehicle_details` WRITE;
/*!40000 ALTER TABLE `vehicle_details` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicle_management_list`
--

DROP TABLE IF EXISTS `vehicle_management_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_management_list` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `non_homeowners` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_of_vehicle` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `incase_of_emergency_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `incase_of_emergency_number` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `vehicle_management_list_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicle_management_list`
--

LOCK TABLES `vehicle_management_list` WRITE;
/*!40000 ALTER TABLE `vehicle_management_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `vehicle_management_list` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-21  6:31:53
