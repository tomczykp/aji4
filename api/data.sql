--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: category_model; Type: TABLE DATA; Schema: public; Owner: aji
--

COPY public.category_model (id, name) FROM stdin;
38d237ee-a5cf-41f0-a68a-ec635dd1fead	Pieczywo
f746a58d-5de9-473c-a60b-ed58810d30ef	Owoce
17272264-7b86-46fc-a41f-c006b5b6181f	Mleczne
242d332c-bec7-4e0c-ac02-12cd6c96411d	Nowa
\.


--
-- Data for Name: user_model; Type: TABLE DATA; Schema: public; Owner: aji
--

COPY public.user_model (id, username, password, role, "createdAt", "updatedAt") FROM stdin;
03e3f7b2-edb0-4340-be4f-8fcb567db474	user	$2a$08$8QMDTfk93ZUeDYmBH8UWouOl4lj5Ds1Uajz4jyZbCDZgBLbSVYSHi	user	2023-01-09 19:05:40.340554	2023-01-09 19:05:40.340554
3a15389a-1b7a-47ae-98ca-84975a3d18e2	user1	$2a$08$5GQNCTfmv1JzxPvXH5aGC.QeBILOrLEHHEIVh0x5EjRZngBuYs6KK	user	2023-01-09 19:05:47.865286	2023-01-09 19:05:47.865286
353aa722-87ec-4eca-a0ba-9f1a6da30166	admin	$2a$08$MRVnKEwM2lpTjuewGDArD.LXcx4Rd8xkY3v5bGzh2gbXkwzZ73Jse	admin	2023-01-09 19:05:32.791577	2023-01-09 19:05:32.791577
e10428e2-cb50-483f-bb68-65682dccced7	user2	$2a$08$dbLAQOPlo7cNv660ki2z2u2zeT9v8KTwyEW7Nj1iiuLaWsIyRNoGO	user	2023-01-09 19:08:27.94522	2023-01-09 19:08:27.94522
\.


--
-- Data for Name: order_model; Type: TABLE DATA; Schema: public; Owner: aji
--

COPY public.order_model (id, status, "createdAt", "updatedAt", "userId") FROM stdin;
edba8a6d-88cc-453f-84ef-bc623989b9c6	0	2023-01-09 19:12:35.151154	2023-01-09 19:12:35.151154	03e3f7b2-edb0-4340-be4f-8fcb567db474
86238095-a23a-4d13-89d5-b5eb3cf20a37	1	2023-01-09 19:13:07.093474	2023-01-09 20:16:22.400583	e10428e2-cb50-483f-bb68-65682dccced7
62adaa3f-2737-474b-a3b0-e1ea1598c549	1	2023-01-09 19:12:13.374789	2023-01-09 20:19:46.25354	03e3f7b2-edb0-4340-be4f-8fcb567db474
\.


--
-- Data for Name: product_model; Type: TABLE DATA; Schema: public; Owner: aji
--

COPY public.product_model (id, name, price, weight, "categoryId") FROM stdin;
1748d976-0d91-4e06-b576-0d0cd17e5db8	Chleb	1.99	1	38d237ee-a5cf-41f0-a68a-ec635dd1fead
1ba184b7-bcd2-4799-a0b2-70cb3aaf4343	Bułeczki	0.99	1.9	38d237ee-a5cf-41f0-a68a-ec635dd1fead
37cc8418-b3b6-4066-9487-d3b4aaad840f	Śmietana	13.89	200	17272264-7b86-46fc-a41f-c006b5b6181f
c516dee0-b091-49dc-af7f-f3c6960700d4	Arbuz	20.99	90	f746a58d-5de9-473c-a60b-ed58810d30ef
dd5472b2-20ef-4341-b035-86383a71c0e8	Jogurt	8.99	450	17272264-7b86-46fc-a41f-c006b5b6181f
\.


--
-- Data for Name: sub_order_model; Type: TABLE DATA; Schema: public; Owner: aji
--

COPY public.sub_order_model (id, amount, "productId", "orderId") FROM stdin;
a1d34ee5-05de-4bd8-a2de-bde050582bc0	2	dd5472b2-20ef-4341-b035-86383a71c0e8	62adaa3f-2737-474b-a3b0-e1ea1598c549
3126efe4-eddf-460d-a70d-54786f94332e	2	37cc8418-b3b6-4066-9487-d3b4aaad840f	62adaa3f-2737-474b-a3b0-e1ea1598c549
24f7ac0a-1e3c-40a4-a6cd-7229a932da35	1	c516dee0-b091-49dc-af7f-f3c6960700d4	62adaa3f-2737-474b-a3b0-e1ea1598c549
61a0bc8b-9f41-4050-aa52-5357e6015697	5	c516dee0-b091-49dc-af7f-f3c6960700d4	edba8a6d-88cc-453f-84ef-bc623989b9c6
d43d936d-2544-406e-ace7-6c99f768db76	3	1748d976-0d91-4e06-b576-0d0cd17e5db8	86238095-a23a-4d13-89d5-b5eb3cf20a37
3ced9728-0f8a-48e0-810d-381281ec4513	1	37cc8418-b3b6-4066-9487-d3b4aaad840f	86238095-a23a-4d13-89d5-b5eb3cf20a37
\.


--
-- PostgreSQL database dump complete
--

