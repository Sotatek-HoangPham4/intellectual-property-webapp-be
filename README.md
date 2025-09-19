<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

```
src/
├─ config/
│  ├─ configuration.ts        # Centralized config loader (env vars, DB URLs, secrets)
│  └─ validation.ts           # Validates environment variables before app starts
├─ core/
│  ├─ application/
│  │  ├─ dto/
│  │  │  ├─ auth/
│  │  │  │  ├─ auth.dto.ts         # Base auth response/request DTO
│  │  │  │  ├─ login.dto.ts        # DTO for login payload
│  │  │  │  ├─ oauth.dto.ts        # DTO for OAuth provider login (code, state)
│  │  │  │  ├─ refresh.dto.ts      # DTO for refresh token request
│  │  │  │  ├─ register.dto.ts     # DTO for user registration
│  │  │  │  └─ tokens.dto.ts       # DTO containing access/refresh tokens
│  │  │  ├─ communication/         # DTOs for communication layer (email, SMS)
│  │  │  ├─ security/
│  │  │  │  ├─ 2fa/
│  │  │  │  │  ├─ setup-2fa.dto.ts   # Request to setup 2FA (TOTP)
│  │  │  │  │  └─ verify-2fa.dto.ts  # Request to verify 2FA code
│  │  │  │  └─ password/
│  │  │  │     ├─ change-password.dto.ts # Payload for password change
│  │  │  │     ├─ forgot-password.dto.ts # Payload for forgot password (email)
│  │  │  │     └─ reset-password.dto.ts  # Payload for reset password (token + new password)
│  │  │  └─ user/
│  │  │     ├─ create-user.dto.ts  # DTO for creating a user (admin, service)
│  │  │     └─ user.dto.ts         # Standard user response DTO
│  │  ├─ mappers/
│  │  │  ├─ oauth.mapper.ts        # Map OAuth provider data -> User entity
│  │  │  └─ user.mapper.ts         # Map User entity -> User DTO
│  │  └─ use-cases/
│  │     ├─ auth/
│  │     │  ├─ login-with-oauth.use-case.ts # Handle OAuth login flow
│  │     │  ├─ login.use-case.ts            # Handle normal login
│  │     │  ├─ magic-link-request.use-case.ts # Send magic link email
│  │     │  ├─ magic-link-verify.use-case.ts  # Verify magic link
│  │     │  ├─ refresh-token.use-case.ts      # Generate new access token from refresh token
│  │     │  ├─ register.use-case.ts           # Register user
│  │     │  ├─ revoke-token.use-case.ts       # Revoke refresh token
│  │     │  ├─ webauthn-authenticate.use-case.ts # WebAuthn login
│  │     │  └─ webauthn-register.use-case.ts     # WebAuthn register
│  │     ├─ oauth/
│  │     │  ├─ login-with-external-provider.use-case.ts # Generic OAuth login handler
│  │     │  └─ login-with-saml.use-case.ts              # Handle SAML SSO login
│  │     ├─ security/
│  │     │  ├─ 2fa/
│  │     │  │  ├─ disable-2fa.use-case.ts   # Disable 2FA for user
│  │     │  │  ├─ totp-setup.use-case.ts    # Setup TOTP secret
│  │     │  │  └─ totp-verify.use-case.ts   # Verify TOTP code
│  │     │  ├─ password/
│  │     │  │  ├─ change-password.use-case.ts # Change password use case
│  │     │  │  ├─ forgot-password.use-case.ts # Send reset link
│  │     │  │  └─ reset-password.use-case.ts  # Reset password
│  │     │  └─ sessions/
│  │     │     ├─ list-sessions.use-case.ts   # List active sessions for a user
│  │     │     └─ revoke-session.use-case.ts  # Kill a session by ID
│  │     └─ user/
│  │        ├─ create-user.use-case.ts   # Business logic for creating a user
│  │        ├─ delete-user.use-case.ts   # Delete user by ID
│  │        ├─ get-user.use-case.ts      # Fetch user details
│  │        └─ update-user.use-case.ts   # Update user info
│  └─ domain/
│     ├─ entities/
│     │  ├─ session.entity.ts  # Domain representation of session
│     │  ├─ token.entity.ts    # Domain representation of token (refresh token)
│     │  └─ user.entity.ts     # Domain representation of user (id, email, password)
│     ├─ repositories/
│     │  ├─ session.repository.ts # Interface for session storage
│     │  ├─ token.repository.ts   # Interface for token storage
│     │  └─ user.repository.ts    # Interface for user storage
│     ├─ services/
│     │  └─ password-policy.service.ts # Business rules for password strength, expiration
│     └─ value-objects/
│        └─ email.vo.ts # Value object for validating/formatting email
├─ infrastructure/
│  ├─ adapters/
│  │  ├─ email/templates/
│  │  │  ├─ magic-link.template.hbs    # Handlebars template for magic link email
│  │  │  ├─ password-reset.template.hbs# Template for reset password email
│  │  │  └─ welcome.template.hbs       # Template for welcome email
│  │  └─ oauth/
│  │     └─ oauth.session.adapter.ts   # Store temporary OAuth session (e.g. in Redis)
│  ├─ auth/
│  │  ├─ strategies/
│  │  │  ├─ facebook.strategy.ts  # Passport strategy for Facebook OAuth
│  │  │  └─ google.strategy.ts    # Passport strategy for Google OAuth
│  │  └─ jwt.strategy.ts          # Passport strategy for JWT verification
│  ├─ cache/
│  │  ├─ rate-limit/login-rate-limiter.service.ts # Service to limit login attempts
│  │  └─ redis.client.ts          # Redis connection client
│  ├─ db/
│  │  ├─ entities/user.orm-entity.ts # Database entity for user (ORM)
│  │  ├─ migrations/              # DB migration scripts
│  │  ├─ prisma/prisma.service.ts # Prisma database connection
│  │  └─ typeorm/
│  │     ├─ audit-log.repository.impl.ts # Log user auth events
│  │     ├─ session.repository.impl.ts   # DB implementation of session repository
│  │     ├─ token.repository.impl.ts     # DB implementation of token repository
│  │     └─ user.repository.impl.ts      # DB implementation of user repository
│  ├─ email/email.client.ts      # Email sending client (SMTP/SES)
│  ├─ oauth/
│  │  ├─ facebook.adapter.ts     # Facebook API adapter
│  │  ├─ github.adapter.ts       # GitHub API adapter
│  │  ├─ google.adapter.ts       # Google API adapter
│  │  ├─ oidc.adapter.ts         # OIDC generic adapter
│  │  └─ saml.adapter.ts         # SAML login adapter
│  ├─ security/
│  │  ├─ bcrypt.service.ts       # Password hashing service
│  │  ├─ hmac-hash.service.ts    # Token hashing service
│  │  └─ jwt.service.ts          # JWT sign/verify service
│  ├─ sms/sms.client.ts          # SMS sending client
│  └─ webauthn/webauthn.adapter.ts # WebAuthn server-side adapter
├─ interfaces/
│  ├─ http/
│  │  ├─ auth/
│  │  │  ├─ guards/
│  │  │  │  ├─ jwt-auth.guard.ts       # Guard that protects endpoints with JWT
│  │  │  │  ├─ permissions.guard.ts    # Guard for fine-grained permissions
│  │  │  │  ├─ refresh-token.guard.ts  # Guard for refresh token endpoints
│  │  │  │  └─ roles.guard.ts          # Guard for role-based access control
│  │  │  ├─ auth.controller.ts         # REST API endpoints for login, register, refresh
│  │  │  ├─ auth.module.ts             # Nest module for auth (registers strategies, providers)
│  │  │  └─ auth.service.ts            # Orchestrates auth use cases (application layer)
│  │  ├─ oauth/
│  │  │  ├─ oauth.controller.ts        # Endpoints for OAuth redirect/callback
│  │  │  └─ oauth.service.ts           # Service that calls OAuth use cases
│  │  ├─ security/
│  │  │  ├─ 2fa/2fa.controller.ts      # Endpoints for enabling/disabling 2FA
│  │  │  ├─ 2fa/2fa.service.ts         # 2FA orchestration service
│  │  │  ├─ password/password.controller.ts # Endpoints for password reset/change
│  │  │  ├─ password/password.service.ts    # Calls password use cases
│  │  │  ├─ session/session.controller.ts   # Endpoints to list/revoke sessions
│  │  │  └─ session/session.service.ts      # Calls session use cases
│  │  └─ token/
│  │     ├─ token.controller.ts        # Endpoints for token refresh/revoke
│  │     └─ token.service.ts           # Calls token use cases
│  └─ user/
│     ├─ user.controller.ts            # User profile endpoints
│     └─ user.module.ts                # Nest module for user feature
├─ scripts/
│  └─ account-seed.ts           # Script to seed initial users (admin/test)
├─ shared/
│  ├─ decorators/roles.decorator.ts # Custom decorator for RBAC
│  ├─ exceptions/not-found.exception.ts # Custom NotFoundException
│  ├─ filters/global-exception.filter.ts # Global exception handler
│  ├─ interceptors/response.interceptor.ts # Transform responses globally
│  ├─ utils/
│  │  ├─ api-response.ts        # Standard API response wrapper
│  │  ├─ hash-token.ts          # Utility to hash tokens
│  │  ├─ response.helper.ts     # Helper for consistent response formatting
│  │  └─ time.util.ts           # Time/date utilities
├─ app.module.ts                # Root Nest module, imports all feature modules
└─ main.ts                      # Application bootstrap (entry point)

```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
