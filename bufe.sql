-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Dec 16. 10:21
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `bufe`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalo`
--

CREATE TABLE `felhasznalo` (
  `id` int(11) NOT NULL,
  `name` varchar(60) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pwd` varchar(60) NOT NULL,
  `role` varchar(10) NOT NULL,
  `class` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `felhasznalo`
--

INSERT INTO `felhasznalo` (`id`, `name`, `email`, `pwd`, `role`, `class`) VALUES
(1, 'teszt diak', 'tesztdiak@gmail.com', '123', 'user', ''),
(2, 'John Doe', 'johndoe@gmail.com', '123', 'user', ''),
(3, 'Jane Doe', 'janedoe@gmail.com', '123', 'user', ''),
(4, 'Jutka Néni', 'jutka@ipari.hu', '123', 'user', ''),
(5, 'Büfés Teri', 'bufes@info.hu', '123', 'bufes', ''),
(6, 'Teszt Elek', 'tesztelek@gmail.com', 'asd', 'user', '13C'),
(8, 'asd', 'tesztk@gmail.com', 'asdasdsad', 'user', '13c'),
(9, 'asd', 'tesztk@sgmail.com', 'asdasdsad', 'user', '13c'),
(10, 'asd', 'tesztk@sadsgmail.com', 'asdasdsad', 'user', '13c'),
(11, 'asd', 'tesztk@sadsgsmail.com', 'asdasdsad', 'user', '13c'),
(12, 'asd', 'tesztsk@sadsgsmail.com', '$2y$10$RpAc5CXIgZsLRBbKxI0zOut3uNXYI1VUlfn.G6c0oXF', 'user', '13c'),
(13, 'asd', 'tesztsk@sasdsgsmail.com', '$2y$10$29EYMIlZDQfHrkSG8B9il.JVAuNCBNgwu0DqdJ.biw/', 'user', '13c'),
(14, 'asd', 'tesztsk@sasdsgssmail.com', '$2y$10$hxMA4ZceLKJ05EzDkjFrWuuGGunzbscGiGdwQPmaORs', 'user', '13c'),
(15, 'asd', 'asd@gmail.com', '$2y$10$UCmCL3Kkk2WiUMGohdWlRePHniYH1bOCU.R8OrEdpQm', 'user', 'asd'),
(16, 'asd', 'as1d@gmail.com', '$2y$10$HGOpsoecLnI3o9XQA2/eLObUSPmwZWDVILs2eSlwSff', 'user', 'asd'),
(17, 'asd', 'as1d1@gmail.com', '$2y$10$oUDjOVXth9g8boLQQPmwtOqXH8kI21tl0cGHQCqn9wf', 'user', 'asd'),
(18, 'asd', 'asasd1d@gmail.com', '$2y$10$9ADwvbVAlkfZu8yUFvkIKu5A1nA42z3ARZ8UeOz3xp/', 'user', '13c'),
(19, 'asd', 'asd1@gmail.com', '$2y$10$97jbx5dMJCpQKQS3P90VuO7KcF4h5C1A6sIic9l0wMh', 'user', '13C'),
(20, 'test', 'test@gmail.com', '$2y$10$C7MNJ9PY6AHGZMAtviwjyO4kDKcTGPbs9CPHVoEzYqi', 'user', '13C'),
(21, 'Pap Adrián', 'pap@gmail.com', '$2y$10$OJ9XzoNrlwFthtVmyQIDueOrPP1dyv.2fsX19.9qMKY', 'user', '13C'),
(22, 'Papi', 'armin@gmail.com', '$2y$10$AiFPrPJP0dliep0Z6fkZDuFA7nygfui0XjLLdAC4pH5', 'user', '13c'),
(23, '11', '12csads@sada.com', '$2y$10$0fiHmfL.mZ5dRQCtxwsBl.p6uR6iAdY0fi2tRbl20/E', 'user', '13C'),
(24, 'sad', 'as1dsdaasd@gmail.com', '$2y$10$YSr6fHhUxYLI0icjCFzcvehHorIqrYgCW5WVoi0zELa', 'user', 'asd'),
(25, 'Pap Adrián', 'teszt@gmail.com', '$2y$10$6KWkUG/lCXlulWH4G82FROGSflX.z4s7Te3T8Mr4abv', 'user', '13C'),
(26, 'Pap Adrián', 'test1@gmail.com', '$2y$10$ROBT.lOn.qgsRxy/N5bX5uRfz22CuLGyfYeN3BBeWhus6fNzUg9Fe', 'user', '13C'),
(27, 'asd', 'sugar@gmail.com', '$2y$10$ZwqSokHKtE11EdjRDVm/gurPr0B0VSzANG/JrDcKQInuJtYedDxVC', 'user', '13C'),
(28, 'adsad', 'asdasdadssad@gmail.com', '$2y$10$l39r0O5l21AaQui7WKvO.uwtYhSVO5SBKar8NBmG6Uhbw0bKzodZa', 'user', '13C'),
(29, 'asddasdsad', 'asdasdsadasd@gmail.com', '$2y$10$DtN9G2/V9gDK.edToW/qOegutu.NAnepG056jPgJxTWIhtkwlYQMS', 'user', '13C'),
(30, 'asddsadasdsad', 'asáfjafa@gmail.com', '$2y$10$kzLQsK6GMwPXnsesexgkAO/u2/u4f525nX/xA7mwAjPc8ZoiiBoOG', 'user', 'adassad'),
(31, 'das', 'sugarmartonlevente@gmail.com', '$2y$10$1KPicLlUpgx4KeRtPe0El.00bPW3WG4vpWEuwh8gzCuq8MKErKhG2', 'user', 'asd'),
(32, 'TesztElek', 'testtest@gmail.com', '$2y$10$pZhq6t9clUnJpElB9ypAt.W8yBopqayV3.hDhU30JP3UhvC0LV0h.', 'user', 'asd'),
(33, 'bufes', 'bufes@gmail.com', '$2y$10$WacGl0wGLYya9dMMNty2qONyytWxmW/k29AZOebXoyENw8aXJRpH2', 'bufes', 'Bufe'),
(34, 'admin', 'admin@gmail.com', '$2y$10$n4yplMoEb.EaZ.7uQOZ5yeHrhLoqRC62qExlrIpTacTF8ue2.mri2', 'admin', '-'),
(35, 'user', 'user@gmail.com', '$2y$10$EASwU3cOWkmyKa66sX7VPeEyZNF/kREuHPs/FjwcPVvK907pVE4ae', 'user', '13C'),
(36, 'das', 'asd11@gmail.com', '$2y$10$2d6O8mJkk2q2KZro16kqeO6j.6RZAUex9F5s3h0KZFrG9qLLem6vG', 'user', 'asd');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `menuk`
--

CREATE TABLE `menuk` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- A tábla adatainak kiíratása `menuk`
--

INSERT INTO `menuk` (`id`, `name`, `price`, `img`) VALUES
(9, 'asd', 10, '1765268816_Image_20251121_101222_784.jpeg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `menutermek`
--

CREATE TABLE `menutermek` (
  `id` int(11) NOT NULL,
  `menu_id` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- A tábla adatainak kiíratása `menutermek`
--

INSERT INTO `menutermek` (`id`, `menu_id`, `termek_id`) VALUES
(9, 9, 9),
(10, 9, 18);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles`
--

CREATE TABLE `rendeles` (
  `id` int(10) NOT NULL,
  `felh_id` int(10) NOT NULL,
  `datumido` datetime NOT NULL,
  `statusz_id` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `rendeles`
--

INSERT INTO `rendeles` (`id`, `felh_id`, `datumido`, `statusz_id`) VALUES
(1, 2, '2025-11-11 18:08:12', 4),
(7, 8, '2025-11-13 13:14:33', 1),
(8, 9, '2025-11-13 14:59:01', 2),
(9, 10, '2025-11-13 15:32:47', 3),
(10, 11, '2025-11-13 16:17:26', 4),
(11, 12, '2025-11-13 17:48:52', 2),
(13, 14, '2025-11-13 19:01:11', 3),
(14, 2, '2025-11-14 07:24:06', 2),
(15, 3, '2025-11-14 07:45:29', 4),
(16, 4, '2025-11-14 08:01:58', 3),
(17, 6, '2025-11-14 08:22:37', 1),
(18, 8, '2025-11-14 08:35:50', 2),
(19, 9, '2025-11-14 08:49:02', 3),
(21, 11, '2025-11-14 09:14:51', 2),
(22, 12, '2025-11-14 09:28:09', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelestartalma`
--

CREATE TABLE `rendelestartalma` (
  `id` int(11) NOT NULL,
  `term_id` int(11) NOT NULL,
  `rend_id` int(11) NOT NULL,
  `mennyiseg` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `statusz`
--

CREATE TABLE `statusz` (
  `id` int(11) NOT NULL,
  `nev` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `statusz`
--

INSERT INTO `statusz` (`id`, `nev`) VALUES
(1, 'kosárban'),
(2, 'leadva'),
(3, 'átvehető'),
(4, 'átvéve');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termek`
--

CREATE TABLE `termek` (
  `id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL,
  `kategoria` varchar(20) NOT NULL,
  `leiras` varchar(200) NOT NULL,
  `img` varchar(255) NOT NULL,
  `ar` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `termek`
--

INSERT INTO `termek` (`id`, `nev`, `kategoria`, `leiras`, `img`, `ar`) VALUES
(9, 'Balaton szelet', 'édesség', 'Ropogós ostya csokoládébevonattal.', 'xyz', 290),
(12, 'Fanta Narancs 0.5L', 'üdítő', 'Gyümölcsös üdítőital narancs ízben.', 'xyz', 480),
(14, 'Sonkás szendvics', 'szendvics', 'Friss zsemlében sonka, sajt és saláta.', 'xyz', 890),
(16, 'Csirkés bagett', 'szendvics', 'Meleg csirkemelles bagett friss zöldségekkel.', 'xyz', 990),
(17, 'Sós mogyoró', 'snack', 'Klasszikus sós pörkölt mogyoró.', 'xyz', 350),
(18, 'Chips sajtos', 'snack', 'Ropogós burgonyachips sajtos ízesítéssel.', 'xyz', 420),
(19, 'Nachos salsa szósszal', 'snack', 'Tortilla chips pikáns szósszal.', 'xyz', 590),
(20, 'Espresso', 'kávé', 'Erős, aromás olasz kávé.', 'xyz', 450),
(21, 'Cappuccino', 'kávé', 'Lágy, tejes kávékülönlegesség.', 'xyz', 550),
(22, 'Jegeskávé', 'kávé', 'Hűsítő, édes kávé jégkockákkal.', 'xyz', 600),
(23, 'Sport szelet', 'édesség', 'Energiát adó kakaós szelet rumos ízzel.', 'xyz', 320),
(24, 'Bounty', 'édesség', 'Kókuszos édesség csokoládébevonattal.', 'xyz', 390),
(25, 'Snickers', 'édesség', 'Mogyorós karamell szelet csokiban.', 'xyz', 420),
(26, 'Twix', 'édesség', 'Karamellás kekszcsík tejcsokoládéban.', 'xyz', 410),
(27, 'Mars', 'édesség', 'Csokis-karamellás finomság minden alkalomra.', 'xyz', 430),
(28, 'Nestea Barack 0.5L', 'üdítő', 'Barack ízű jeges tea frissítően.', 'xyz', 440),
(29, 'Sprite 0.5L', 'üdítő', 'Citrom-lime ízű szénsavas üdítő.', 'xyz', 470),
(30, 'Hell energiaital', 'üdítő', 'Energiát adó ital koffeinnel.', 'xyz', 590),
(31, 'Gyros szendvics', 'szendvics', 'Ízletes pita csirkés gyros hússal és zöldséggel.', 'xyz', 1150),
(32, 'Tonhalas szendvics', 'szendvics', 'Friss tonhalas bagett majonézzel.', 'xyz', 980),
(33, 'Kétsajtos szendvics', 'szendvics', 'Sajtkedvelőknek dupla adaggal.', 'xyz', 870),
(34, 'Popcorn sós', 'snack', 'Friss pattogatott kukorica, mozihangulatban.', 'xyz', 300),
(35, 'Ropi', 'snack', 'Klasszikus sós ropi ropogtatnivalónak.', 'xyz', 250),
(36, 'Pisztácia', 'snack', 'Pirított pisztácia héjában.', 'xyz', 690),
(37, 'Latte Macchiato', 'kávé', 'Tejeskávé lágy habbal a tetején.', 'xyz', 590),
(38, 'Americano', 'kávé', 'Hosszú fekete kávé, lágy ízzel.', 'xyz', 480),
(39, 'Forró csoki', 'kávé', 'Selymes forró csokoládé hideg napokra.', 'xyz', 620),
(40, 'Kinder Bueno', 'édesség', 'Krémes mogyorós töltelék ropogós ostyában.', 'xyz', 450),
(41, 'M&M\'s', 'édesség', 'Színes cukorbevonatú csokigolyók.', 'xyz', 470),
(49, 'Ármin', 'dik', 'XD', '1764929916_Image_20251121_100010_248.jpeg', 100),
(50, 'sd', 'dik', 'XD', '1764929931_Képkivágás.PNG', 100),
(51, 'Csokis csigusz', 'édesség', 'finom csokis csiga', '1764930055_asd.png', 999),
(53, 'papa kedvence', 'édesség', 'papsmoke kedvence', '1765276555_image1.png', 800);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `visszajelzes`
--

CREATE TABLE `visszajelzes` (
  `id` int(11) NOT NULL,
  `felh_id` int(11) NOT NULL,
  `szoveg` varchar(500) NOT NULL,
  `kategoria` varchar(20) NOT NULL,
  `datumido` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `visszajelzes`
--

INSERT INTO `visszajelzes` (`id`, `felh_id`, `szoveg`, `kategoria`, `datumido`) VALUES
(1, 2, 'Igazan finom a narancsos bukta, legyen még, puszi', 'Termék', '2025-11-11 18:06:54'),
(2, 1, 'Panaszt szeretnék tenni, mert a büfés arcon köpöt, amikor melegszendvicset rendeltem, nem akart kiszolgálni', 'Kiszolgálás', '2025-11-12 08:10:58'),
(3, 2, 'Nagyon finom volt a hotdog!', 'Termék', '2025-11-13 09:12:44'),
(4, 3, 'Gyors volt a kiszolgálás.', 'Kiszolgálás', '2025-11-13 10:01:32'),
(5, 4, 'Lehetne több süti.', 'Termék', '2025-11-13 10:55:10'),
(6, 6, 'Kicsit hosszú volt a sor.', 'Kiszolgálás', '2025-11-13 11:17:28'),
(7, 8, 'Nagyon jó az új hamburger!', 'Termék', '2025-11-13 12:05:15'),
(8, 9, 'Túl sós volt a szendvics.', 'Termék', '2025-11-13 12:30:22'),
(9, 10, 'Kedves volt a büfés.', 'Kiszolgálás', '2025-11-13 13:44:51'),
(10, 11, 'Elfogyott mire odaértem.', 'Készlet', '2025-11-13 14:22:33'),
(11, 12, 'Túl drága lett minden.', 'Ár', '2025-11-13 15:12:02'),
(12, 13, 'Gyors és finom volt!', 'Kiszolgálás', '2025-11-13 15:48:19'),
(13, 14, 'Lehetne több ital opció.', 'Termék', '2025-11-13 16:05:42'),
(14, 2, 'Nagyon friss volt minden.', 'Termék', '2025-11-14 07:30:10'),
(15, 3, 'A pizza kicsit hideg volt.', 'Termék', '2025-11-14 07:45:51'),
(16, 4, 'Gyors kiszolgálás reggel!', 'Kiszolgálás', '2025-11-14 08:02:17'),
(17, 6, 'Túl hangos volt a sor.', 'Egyéb', '2025-11-14 08:20:09'),
(18, 8, 'A burgonya finom volt.', 'Termék', '2025-11-14 08:34:51'),
(19, 9, 'Jó lenne több egészséges opció.', 'Termék', '2025-11-14 08:50:11'),
(20, 10, 'A büfés kedvesen segített.', 'Kiszolgálás', '2025-11-14 09:03:55'),
(21, 11, 'Kicsit sokat kellett várni.', 'Kiszolgálás', '2025-11-14 09:15:27'),
(22, 12, 'Nagyon jó árak voltak ma.', 'Ár', '2025-11-14 09:28:42');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `felhasznalo`
--
ALTER TABLE `felhasznalo`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `menuk`
--
ALTER TABLE `menuk`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `menutermek`
--
ALTER TABLE `menutermek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menu` (`menu_id`),
  ADD KEY `termek` (`termek_id`);

--
-- A tábla indexei `rendeles`
--
ALTER TABLE `rendeles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felh_id` (`felh_id`),
  ADD KEY `statusz_id` (`statusz_id`);

--
-- A tábla indexei `rendelestartalma`
--
ALTER TABLE `rendelestartalma`
  ADD PRIMARY KEY (`id`),
  ADD KEY `term_id` (`term_id`,`rend_id`),
  ADD KEY `rend_id` (`rend_id`);

--
-- A tábla indexei `statusz`
--
ALTER TABLE `statusz`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `termek`
--
ALTER TABLE `termek`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `visszajelzes`
--
ALTER TABLE `visszajelzes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `felh_id` (`felh_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `felhasznalo`
--
ALTER TABLE `felhasznalo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT a táblához `menuk`
--
ALTER TABLE `menuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT a táblához `menutermek`
--
ALTER TABLE `menutermek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT a táblához `rendeles`
--
ALTER TABLE `rendeles`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `rendelestartalma`
--
ALTER TABLE `rendelestartalma`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT a táblához `termek`
--
ALTER TABLE `termek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT a táblához `visszajelzes`
--
ALTER TABLE `visszajelzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `menutermek`
--
ALTER TABLE `menutermek`
  ADD CONSTRAINT `menutermek_ibfk_2` FOREIGN KEY (`termek_id`) REFERENCES `termek` (`id`),
  ADD CONSTRAINT `menutermek_ibfk_3` FOREIGN KEY (`menu_id`) REFERENCES `menuk` (`id`);

--
-- Megkötések a táblához `rendeles`
--
ALTER TABLE `rendeles`
  ADD CONSTRAINT `rendeles_ibfk_1` FOREIGN KEY (`statusz_id`) REFERENCES `statusz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rendeles_ibfk_2` FOREIGN KEY (`felh_id`) REFERENCES `felhasznalo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `rendelestartalma`
--
ALTER TABLE `rendelestartalma`
  ADD CONSTRAINT `rendelestartalma_ibfk_1` FOREIGN KEY (`term_id`) REFERENCES `termek` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rendelestartalma_ibfk_2` FOREIGN KEY (`rend_id`) REFERENCES `rendeles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `visszajelzes`
--
ALTER TABLE `visszajelzes`
  ADD CONSTRAINT `visszajelzes_ibfk_1` FOREIGN KEY (`felh_id`) REFERENCES `felhasznalo` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
