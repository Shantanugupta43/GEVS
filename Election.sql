-- MySQL dump 10.13 Distrib 8.0.34, for macos13 (x86_64)
--
-- Host: localhost    Database: co3102_cw2_2023
-- ------------------------------------------------------
-- Server version	8.2.0

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
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidate` (
  `canid` int NOT NULL AUTO_INCREMENT,
  `candidate` varchar(100) DEFAULT NULL,
  `party_id` int NOT NULL,
  `constituency_id` int NOT NULL,
  `vote_count` int DEFAULT NULL,
  PRIMARY KEY (`canid`),
  KEY `pid_idx` (`party_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
INSERT INTO `candidate` VALUES (1,'Candidate 1',2,1,0);
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `constituency`
--

DROP TABLE IF EXISTS `constituency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `constituency` (
  `constituency_id` int NOT NULL AUTO_INCREMENT,
  `constituency_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`constituency_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `constituency`
--

LOCK TABLES `constituency` WRITE;
/*!40000 ALTER TABLE `constituency` DISABLE KEYS */;
INSERT INTO `constituency` VALUES (1,'Shangri-la-Town'),(2,'Northern-Kunlun-Mountain'),(3,'Western-Shangri-la'),(4,'Naboo-Vallery'),(5,'New-Felucia');
/*!40000 ALTER TABLE `constituency` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `party`
--

DROP TABLE IF EXISTS `party`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `party` (
  `party_id` int NOT NULL AUTO_INCREMENT,
  `party` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`party_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `party`
--

LOCK TABLES `party` WRITE;
/*!40000 ALTER TABLE `party` DISABLE KEYS */;
INSERT INTO `party` VALUES (1,'Blue Party'),(2,'Red Party'),(3,'Yellow Party'),(4,'Independent');
/*!40000 ALTER TABLE `party` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uvc_code`
--

DROP TABLE IF EXISTS `uvc_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uvc_code` (
  `UVC` varchar(50) NOT NULL,
  `used` int DEFAULT NULL,
  PRIMARY KEY (`UVC`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uvc_code`
--

LOCK TABLES `uvc_code` WRITE;
/*!40000 ALTER TABLE `uvc_code` DISABLE KEYS */;
INSERT INTO `uvc_code` VALUES ('2E5BHT5R',0),('2GYDT5D3',0),('2LJFM6PM',0),('2TEHRTHJ',0),('38NWLPY3',0),('5492AC6V',0),('556JTA32',0),('75NKUXAH',0),('7983XU4M',0),('7XUFD78Y',0),('8TEXF2HD',0),('9FCV9RMT',0),('9GTZQNKB',0),('B7DMPWCQ',0),('BBMNS9ZJ',0),('BKMKJN5S',0),('BQCRWTSG',0),('D5BG6FDH',0),('DBAD57ZR',0),('DBP4GQBQ',0),('DHKVCU8T',0),('G994LD9T',0),('HH64FWPE',0),('JA9WCMAS',0),('JF2QD3UF',0),('K3EVS3NM',0),('K96JNSXY',0),('KSM9NB5L',0),('KYMK9PUH',0),('LUFKZAHW',0),('LVTFN8G5',0),('ML5NSKKG',0),('N6HBFD2X',0),('NW9ETHS7',0),('PFXB8QXM',0),('Q452KVQE',0),('RXLNLTA6',0),('TH9A6HUB',0),('TZZZCJV8',0),('U5LGC65X',0),('UMT3RLVS',0),('UNP4A5T7',0),('UVE5M7FR',0),('VFBH8W6W',0),('W44QP7XJ',0),('WL3K3YPT',0),('WPC5GEHA',0),('YADA47RL',0),('Z93G7PN9',0),('ZSRBTK9S',0);
/*!40000 ALTER TABLE `uvc_code` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voters`
--

DROP TABLE IF EXISTS `voters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voters` (
  `voter_id` varchar(50) NOT NULL,
  `full_name` varchar(50) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `password` longtext,
  `UVC` varchar(45) DEFAULT NULL,
  `constituency_id` int DEFAULT NULL,
  PRIMARY KEY (`voter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `admin_email` varchar(100) NOT NULL,
  `password` longtext NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_email_UNIQUE` (`admin_email`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert data into the `admin` table
INSERT INTO `admin` (`admin_email`, `password`) VALUES
('election@shangrila.gov.sr', '$2a$10$/Y.7DYsRdCx86hOooKo5e.tiHHlxbkl1OvVTvkozh1yXA3oS4dxZK');

/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-14 10:49:54
