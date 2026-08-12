import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Container,
  Separator,
  Heading,
  List,
  Stack,
  Text,
  Image,
} from '@chakra-ui/react'
import type { HeadingProps } from '@chakra-ui/react'
import {
  Email,
  GitHub,
  GoogleMaps,
  Linkedin,
  Website,
} from '@/components/contact'
import { DataDefinition, SectionHeading } from '@/components/typography'
import { AtSignIcon, CalendarIcon } from '@/components/icons'
import type { ReactNode } from 'react'
import '@/cv.css'
import { Link } from '@/components/link'

function Cv() {
  return (
    <Container as="main" mt={6} pb={12}>
      <Box
        id="cv"
        overflow="hidden"
        p={{ base: 8, md: 12 }}
        boxShadow="0 1rem 3rem rgba(0,0,0,.2)"
        bg="gray.50"
        _dark={{ bg: 'gray.800', boxShadow: '0 1rem 3rem rgba(0,0,0,.4)' }}
      >
        <HeaderSection />
        <Separator my={10} />

        <BlurbSection />
        <Separator my={10} />

        <TechnologiesSection />
        <Separator my={10} />

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          gap={{ base: 0, lg: 8 }}
        >
          <Box flex="1.75 1 0">
            <ExperienceSection />
            <Separator my={10} display={{ lg: 'none' }} />
          </Box>
          <Box flex="1 1 0">
            <SkillsSection />
            <Separator my={10} />

            <EducationSection />
          </Box>
        </Stack>
        <Separator my={10} />

        <Footer />
      </Box>
    </Container>
  )
}

function MuteHeading(props: HeadingProps) {
  return (
    <Heading
      as="h3"
      size="md"
      color="gray.600"
      _dark={{ color: 'gray.400' }}
      fontWeight="normal"
      {...props}
    />
  )
}

function HeaderSection() {
  return (
    <Stack direction={{ base: 'column', md: 'row' }} gap="sm">
      <Box flex={1} mb={4}>
        <Heading as="h1" size="5xl">
          Alex Haslehurst
        </Heading>
        <Heading
          as="p"
          size="xl"
          fontWeight="normal"
          color="gray.600"
          _dark={{ color: 'gray.400' }}
        >
          AI Software Engineer
        </Heading>
      </Box>
      <Box>
        <List.Root
          variant="plain"
          color="gray.600"
          _dark={{ color: 'gray.400' }}
        >
          <List.Item>
            <Email />
          </List.Item>
          <List.Item>
            <Website />
          </List.Item>
          <List.Item>
            <GitHub />
          </List.Item>
          <List.Item>
            <Linkedin />
          </List.Item>
          <List.Item>
            <GoogleMaps />
          </List.Item>
        </List.Root>
      </Box>
    </Stack>
  )
}

function BlurbSection() {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      gap="sm"
      alignItems="center"
    >
      <Box id="mugshot" px={{ base: 2, md: 4 }} mb={{ base: 4, md: 0 }}>
        <Image
          borderRadius="full"
          boxSize={{ base: 75, sm: 100, md: 150 }}
          src="/mugshot.png"
          alt="Alex"
        />
      </Box>
      <Box flex={1} px={4}>
        Hi, I&apos;m Alex, a software developer with over 15 years&apos;
        experience across many industries, platforms and within government. I
        have led multiple teams and delivered many full stack projects from
        design to production. I have a strong background in mathematics,
        statistics and data science, which has accelerated my career through
        some really interesting and complex projects. The rise of AI has totally
        transformed my career. I now build agentic applications and the
        platforms that run them; chat interfaces, retrieval over large knowledge
        bases, data exploration and coding tools. It has changed how I build
        software just as much as what I build, and I work alongside coding
        agents every day. I enjoy designing simple, scalable solutions to
        complex problems in an agile team. I like wearing shorts, running and
        retro gaming. I have over 650 stars on GitHub.
      </Box>
    </Stack>
  )
}

function TechnologiesSection() {
  return (
    <>
      <SectionHeading>Technologies</SectionHeading>

      <Text mb={3}>
        I like working with anything that has decent documentation, but I have
        most experience with:
      </Text>

      <DataDefinition
        title="AI"
        value="Claude Code, Amazon Bedrock, OpenAI, MCP, Skills, RAG, Agentic application development, Prompt evaluation"
      />
      <DataDefinition
        title="Machine learning"
        value="Neural networks, genetic algorithms, linear regression, anomaly detection"
      />
      <DataDefinition
        title="Python"
        value="FastAPI, SQLAlchemy, Alembic, Google ADK, Posit, Running python in production"
      />
      <DataDefinition
        title="JDK"
        value="Kotlin, Java, Scala, Clojure, http4k, Ktor, Spring, Hibernate, Gradle, Maven"
      />
      <DataDefinition
        title=".NET"
        value="C#, .NET Core, .NET Framework, EntityFramework, ASP.NET, VB, WCF, MVC"
      />
      <DataDefinition title="Node.js" value="Typescript, Nest.js" />
      <DataDefinition
        title="UI"
        value="React, Next.js, Angular, Vue.js, Android, iOS, legacy browser support, JQuery, GDS (gov.uk)"
      />
      <DataDefinition
        title="Cloud"
        value="AWS, Lambda, Serverless, SAM, Terraform, RDS, EKS, DynamoDB"
      />
      <DataDefinition title="Devops" value="Kubernetes, Rancher, Docker" />
      <DataDefinition
        title="Database"
        value="Postgres, MySQL, SQL Server, Oracle, MongoDB"
      />
      <DataDefinition
        title="Big data"
        value="Cassandra, Kafka, Spark, Datastax Enterprise"
      />
    </>
  )
}

function Experience({
  title,
  url,
  place,
  date,
  tech,
  children,
}: {
  title: string
  place: string
  url?: string
  date: string
  tech?: string
  children: ReactNode
}) {
  return (
    <Box mb={8}>
      <MuteHeading>{title}</MuteHeading>
      <List.Root
        gap={0}
        fontSize="sm"
        mb={2}
        color="gray.600"
        _dark={{ color: 'gray.200' }}
        listStylePosition="outside"
        variant="plain"
      >
        <List.Item>
          <List.Indicator asChild>
            <AtSignIcon />
          </List.Indicator>
          {url ? (
            <Link href={url} external externalIcon={false} variant="plain">
              {place}
            </Link>
          ) : (
            <>{place}</>
          )}
        </List.Item>
        <List.Item>
          <List.Indicator asChild>
            <CalendarIcon />
          </List.Indicator>
          {date}
        </List.Item>
      </List.Root>
      {tech && (
        <Text
          fontSize="sm"
          color="gray.600"
          _dark={{ color: 'gray.200' }}
          mb={2}
        >
          {tech}
        </Text>
      )}
      <Text>{children}</Text>
    </Box>
  )
}

function ExperienceSection() {
  return (
    <>
      <SectionHeading>Experience</SectionHeading>

      <Experience
        title="AI Software Engineer (Contract)"
        place="Equal Experts"
        url="https://www.equalexperts.com/"
        date="SEP 2025 - PRESENT"
        tech="Agentic AI, MCP, RAG, Python, OpenAI, Bedrock, React"
      >
        I am currently working on a software engineering contract in an AI
        Platform Team for HMRC via Equal Experts. I build agentic applications
        to support business processes; chat interfaces, RAG over very large
        vector databases, data exploration and coding tools. I also work on the
        platform underneath them, including an LLM proxy providing request
        routing, rate limiting and consolidated cost control across multiple
        departments.
      </Experience>

      <Experience
        title="Software Developer (Contract)"
        place="JUXT"
        url="https://www.juxt.pro/"
        date="FEB 2022 - SEP 2025"
        tech="Kotlin, Clojure, Java, Kubernetes, Oracle, Solace, OpenShift, Legacy"
      >
        I was technical lead on a successful migration of a 30 year old legacy
        system for Citi, moving both middleware and clients onto a modern stack
        without downtime.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="Ministry of Justice"
        url="https://mojdigital.blog.gov.uk/"
        date="FEB 2021 - FEB 2022"
        tech="Kotlin, Java, Spring, Node.js, Typescript, Nest.js, AWS, Terraform, Kubernetes, GDS, Oracle"
      >
        I joined MoJ digital looking to broaden my experience of working with
        enterprise scale applications having thousands of users with diverse
        accessibility needs. I assumed technical lead on multiple projects,
        which were released through alpha, beta and live phases. I have
        integrated modern, cloud based microservices with legacy monolithic
        applications and supported a general strategy for modern platform
        migration. Much of my work is available publicly on GitHub.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="Inpart"
        url="https://inpart.io/"
        date="JAN 2020 - FEB 2021"
        tech="Node.js, React, Next.js, AWS, Terraform, Serverless, Rancher, OIDC, MySQL"
      >
        Inpart provides a digital partnering platform connecting university
        research with industry R&D. Virtually all technology at Inpart was new
        to me in a commercial context so I valued my time at Inpart as a
        challenge and learning experience. I assumed leadership in security,
        serverless and big data.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="Westfield Health"
        url="https://www.westfieldhealth.com/"
        date="JAN 2018 - JAN 2020"
        tech=".NET, Angular, Vue.js, JQuery, AWS, Terraform, Rancher, Android, iOS"
      >
        Westfield Health is a not-for-profit provider of contributory health
        schemes. I joined to help migrate their legacy business processes
        online, providing technical leadership for a feature team owning
        multiple microservices. I became the technical owner for security and
        platform, distributing libraries, processes and training to build
        conformance across all teams.
      </Experience>

      <Experience
        title="Senior Software Developer"
        place="t-mac Technologies"
        url="https://t-mac.co.uk/"
        date="NOV 2015 - JAN 2018"
        tech="Scala, Spark, Cassandra, Kafka, .NET, Angular, JQuery, MongoDB, MS Sql Server, Docker Swarm"
      >
        At t-mac, I provided technical leadership for a big data focussed team
        processing IoT time series data at scale, presenting analytics onto
        customer dashboards and providing automated insights into portfolio
        performance. I architected the Cassandra, Spark and Kafka platform
        behind it and used Scala to deploy a mixture of custom and off-the-shelf
        machine learning algorithms at scale.
      </Experience>

      <Experience
        title="Earlier career"
        place="Alpharooms, Technolog, Experian"
        date="JUL 2010 - NOV 2015"
        tech=".NET, Java, Spring, C++, MongoDB, Cassandra, Oracle, AWS, JQuery"
      >
        I started my career as an analyst at Experian Decision Analytics, where
        I realised that what little software development I was responsible for
        was what kept me driven and set me apart from my peers. I moved into
        development proper at Technolog, an electronics manufacturer working
        with IoT data, then to Alpharooms, an online travel agent operating at
        scale on AWS.
      </Experience>
    </>
  )
}

function SkillsSection() {
  return (
    <>
      <SectionHeading>Skills</SectionHeading>

      <MuteHeading>AI</MuteHeading>
      <Text mb={3}>
        I build agentic applications and the platforms underneath them; tool use
        and MCP, RAG over large vector stores, progressive disclosure through
        skills, and evaluation harnesses. I also use coding agents every day,
        which has changed how I work more than any other tool in my entire
        career.
      </Text>

      <MuteHeading>Architecture</MuteHeading>
      <Text mb={3}>
        I am a tech leader, I have designed, led and delivered many successful
        projects on modern and legacy infrastructure.
      </Text>

      <MuteHeading>Code</MuteHeading>
      <Text mb={3}>
        I like to diversify my platform experience but no matter the idioms; I
        build simple solutions to complex problems with a TDD methodology.
        Working with coding agents has made me lean on that harder than ever; a
        good test suite is both the brief an agent works to and the proof it got
        there.
      </Text>

      <MuteHeading>Agile</MuteHeading>
      <Text mb={3}>
        I prefer the agile approach of minimising project risk by aiming for
        smaller releases on a frequent, regular cadence. I will build tooling,
        processes and team culture to achieve this.
      </Text>

      <MuteHeading>Cloud</MuteHeading>
      <Text mb={3}>
        I have designed and developed cloud native applications at scale.
        I&apos;m happy to work with any public cloud, infrastructure as code and
        serverless application framework.
      </Text>

      <MuteHeading>UI</MuteHeading>
      <Text mb={3}>
        I understand how UX & consistent styling should work on a modern UI. I
        have worked with massive & complex UIs on top of many frameworks but
        prefer to keep greenfield work as simple and close to standard web
        technologies as possible.
      </Text>

      <MuteHeading>Analytics</MuteHeading>
      <Text mb={3}>
        I have developed machine learning at scale with open source tools. My
        strong background in statistics means I am equally confident in the
        development of custom algorithms as I am with dropping in off-the-shelf
        solutions, and it is what I now lean on to measure whether an AI system
        actually works.
      </Text>

      <MuteHeading>Big data</MuteHeading>
      <Text mb={3}>
        I have led projects moving massive databases into modern scalable
        platforms.
      </Text>

      <MuteHeading>Security</MuteHeading>
      <Text mb={3}>
        I have experience deploying enterprise single-sign-on across legacy,
        modern and third party platforms.
      </Text>

      <MuteHeading>Legacy</MuteHeading>
      <Text mb={3}>
        Most software will eventually become legacy. I have tons of experience
        maintaining a legacy estate whilst strangling features into modern apps.
      </Text>

      <MuteHeading>Government</MuteHeading>
      <Text mb={3}>
        I have a high level of government clearance, please contact me for
        details. I have extensive experience with GDS and gov.uk UI development.
      </Text>
    </>
  )
}

function EducationSection() {
  return (
    <>
      <SectionHeading>Education</SectionHeading>

      <Experience
        title="Mathematics (1st Class Hons)"
        place="Sheffield Hallam University"
        url="https://shu.ac.uk/"
        date="SEP 2006 - JUL 2010"
      >
        Including self enrolled placement year at Experian Decision Analytics.
        Received an award for my outstanding achievement and had my final year
        project, a machine learning piece, exhibited at the university.
      </Experience>
    </>
  )
}

function Footer() {
  return (
    <Stack
      direction={{ base: 'column', md: 'row' }}
      alignItems="center"
      justifyContent="space-around"
      color="gray.600"
      _dark={{ color: 'gray.400' }}
    >
      <Email />
      <Website />
      <GitHub />
      <Linkedin />
    </Stack>
  )
}

export const Route = createFileRoute('/cv')({ component: Cv })
