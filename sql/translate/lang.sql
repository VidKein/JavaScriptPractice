CREATE DATABASE translation_website;

--Неизменяемые элементы сайта(основной контент)
CREATE TABLE `page_tage`(
`id_tage` INT PRIMARY KEY AUTO_INCREMENT,
`name_tage` VARCHAR(50) NOT NULL
);
INSERT INTO page_tage(name_tage) VALUES
 ('title'),
 ('title_page'),
 ('info_site');

--Содержание тегов
--ru
CREATE TABLE `page_value_tage_ru`(
`id_value_tage` INT PRIMARY KEY AUTO_INCREMENT,
`value_tage` VARCHAR(255) NOT NULL
);
INSERT INTO page_value_tage_ru(value_tage) VALUES 
('Перевод веб сайта'),
('Заголовок сайта'),
('Информация о сайте');

--eng
CREATE TABLE `page_value_tage_en`(
`id_value_tage` INT PRIMARY KEY AUTO_INCREMENT,
`value_tage` VARCHAR(255) NOT NULL
);
INSERT INTO page_value_tage_en(value_tage) VALUES 
('Website translation'),
('Site title'),
('Information about the site');

--ua
CREATE TABLE `page_value_tage_uk`(
`id_value_tage` INT PRIMARY KEY AUTO_INCREMENT,
`value_tage` VARCHAR(255) NOT NULL
);
INSERT INTO page_value_tage_uk(value_tage) VALUES 
('Переклад веб сайту'),
('Заголовок сайту'),
('Інформація про сайт');

--Изменяемые элементы сайта
CREATE TABLE `page_dinamic_tage`(
  `id_tage` INT PRIMARY KEY AUTO_INCREMENT,
  `name_tage_dinamic` VARCHAR(50) NOT NULL,
  `url_page` VARCHAR(50) NOT NULL
);
INSERT INTO page_dinamic_tage(name_tage_dinamic, url_page) VALUES 
('url1','./picter1.jpg'),
('url2','./picter2.jpg'),
('url3','./picter3.jpg');

--Переводимый текст
--ru
CREATE TABLE `page_dinamic_value_tage_ru`(
`id_value_tage` INT PRIMARY KEY AUTO_INCREMENT,
`name_button` VARCHAR(10) NOT NULL,
`value_tage` TEXT NOT NULL
);
INSERT INTO page_dinamic_value_tage_ru(name_button, value_tage) VALUES 
('Картинка 1','Красивый пушистый кот с сапфировыми глазами, густой шерстью и белыми лапками — это описание бирманца.
История его происхождения овеяна красивыми легендами. До сих пор неизвестно, какие животные были родоначальниками. На фото 
видно, что по окрасу бирманец похож на сиама, но по характеру — его полная противоположность. Спокойные, любознательные
животные не стесняются выражать свою любовь к хозяевам и в то же время, как истинные аристократы, не будут навязывать своё
общество, если люди заняты и не могут уделить им внимания.'),
('Картинка 2','Это не всегда можно понять по фото, но мейн-куны — коты-великаны. При этом они считаются одной из лучших пород для домашнего
содержания. По-королевски красивая внешность в сочетании с дружелюбным характером — идеальный пример семейного питомца. 
Чем старше они становятся, тем ярче в них проявляются царственные привычки. Они прекрасно чувствуют настроение домочадцев: 
погружаются в задумчивое созерцание, когда хозяева нуждаются в покое и тишине, активно поддерживают игру, если того требует 
ситуация.'),
('Картинка 3','Представителей этой породы можно узнать по внушительным размерам, пушистой шерсти и характерному воротнику вокруг шеи.
Последние два признака хорошо видны на фото. Во внешности сочетаются черты дикого лесного кота и домашнего животного: густая
шерсть, чтобы спасаться от холода, атлетическое сложение и сильные когти, чтобы охотиться, умный внимательный взгляд.
Они уравновешены и рассудительны, как настоящие северные жители.');

--eng
CREATE TABLE `page_dinamic_value_tage_en`(
`id_value_tage` INT PRIMARY KEY AUTO_INCREMENT,
`name_button` VARCHAR(10) NOT NULL,
`value_tage` TEXT NOT NULL
);
INSERT INTO page_dinamic_value_tage_en(name_button, value_tage) VALUES 
('Picture 1','A beautiful fluffy cat with sapphire eyes, thick fur and white paws is a description of the Burmese.
The history of its origin is covered with beautiful legends. It is still unknown which animals were the ancestors. On the picture
It is clear that the Burmese is similar in color to the Siamese, but in character it is its complete opposite. Calm, inquisitive
animals do not hesitate to express their love for their owners and at the same time, like true aristocrats, will not impose their
society if people are busy and cannot pay attention to them.'),
('Picture 2','It’s not always clear from photos, but Maine Coons are giant cats. At the same time, they are considered one of the best breeds for pets.
content. Royally beautiful appearance combined with a friendly character is the perfect example of a family pet.
The older they get, the more royal habits appear in them. They perfectly sense the mood of their household:
plunge into thoughtful contemplation when the owners need peace and quiet, actively support the game if required
situation.'),
('Picture 3','Representatives of this breed can be recognized by their impressive size, fluffy fur and a characteristic collar around the neck.
The last two signs are clearly visible in the photo. The appearance combines the features of a wild forest cat and a domestic animal: thick
wool to protect from the cold, athletic build and strong claws to hunt, intelligent, attentive eyes.
They are balanced and reasonable, like real northern residents.');

--ua
CREATE TABLE `page_dinamic_value_tage_uk`(
`id_value_tage` INT PRIMARY KEY AUTO_INCREMENT,
`name_button` VARCHAR(10) NOT NULL,
`value_tage` TEXT NOT NULL
);
INSERT INTO page_dinamic_value_tage_uk(name_button, value_tage) VALUES 
('Картинка 1','Гарний пухнастий кіт із сапфіровими очима, густою шерстю та білими лапками – це опис бірманця.
Історія його походження овіяна гарними легендами. Досі невідомо, які тварини були родоначальниками. На світлині
видно, що за забарвленням бірманець схожий на сіама, але за характером його повна протилежність. Спокійні, допитливі
тварини не соромляться висловлювати свою любов до господарів і в той же час, як справжні аристократи, не навязуватимуть своє
суспільство, якщо люди зайняті і не можуть приділити їм уваги.'),
('Картинка 2','Це не завжди можна зрозуміти по фото, але мейн-куни коти-велетні. При цьому вони вважаються однією з найкращих порід для домашнього
змісту. Королівськи красива зовнішність у поєднанні з доброзичливим характером — ідеальний приклад сімейного вихованця.
Чим старші вони стають, тим яскравіше у них проявляються царські звички. Вони чудово відчувають настрій домочадців:
поринають у задумливе споглядання, коли господарі потребують спокою та тиші, активно підтримують гру, якщо того вимагає
ситуація.'),
('Картинка 3','Представників цієї породи можна дізнатися за значними розмірами, пухнастою вовною і характерним коміром навколо шиї.
Останні дві ознаки добре видно на фото. У зовнішності поєднуються риси дикого лісового кота та свійської тварини: густа
шерсть, щоб рятуватися від холоду, атлетичне додавання і сильні пазурі, щоб полювати, розумний уважний погляд.
Вони врівноважені та розважливі, як справжнісінькі північні жителі.');