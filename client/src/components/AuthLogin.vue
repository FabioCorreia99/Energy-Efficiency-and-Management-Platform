<script>
import { useMessagesStore } from "@/stores/messages.js";
import { useAuthStore } from "@/stores/auth.js";

export default {
  name: "AuthLogin",
  data() {
    return {
      checkbox: false,
      password: "passteste",
      username: "teste@email.com",
      show1: false,
      isSubmitting: false,
      emailRules: [
        (v) => !!v.trim() || "E-mail is required",
        (v) => {
          const trimmedEmail = v.trim();
          return !/\s/.test(trimmedEmail) || "E-mail must not contain spaces";
        },
        (v) => /.+@.+\..+/.test(v.trim()) || "E-mail must be valid",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => v === v.trim() || "Password cannot start or end with spaces",
        (v) =>
          v.length <= 100 ||
          "Password must be equal or less than 100 characters",
      ],
      forgotPassword: false,
    };
  },
  methods: {
    async validate() {
      this.isSubmitting = true;
      const authStore = useAuthStore();
      const messagesStore = useMessagesStore();
      // this.$refs.form.validate(); // Validate the form
      try {
        const response = await fetch("http://localhost:3000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.username,
            password: this.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          messagesStore.add({
            text: data.message || "Error processing login",
            color: "error",
            timeout: 3000,
          });

          throw new Error(data.message || "Error processing login");
        }

        messagesStore.add({
          text: data.message || "Login successful",
          color: "success",
          timeout: 3000,
        });

        await authStore.setUser(data);
        this.$router.push("/");
      } catch (error) {
        console.log(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    switchToLogin() {
      this.forgotPassword = !this.forgotPassword;
      if (!this.forgotPassword) {
        this.username = "";
        this.password = "";
      }
    },
    switchToForgotPassword() {
      this.forgotPassword = !this.forgotPassword;
      if (this.forgotPassword) {
        this.username = "";
        this.password = "";
      }
    },
    async resetPassword() {
      this.isSubmitting = true;
      const messagesStore = useMessagesStore();

      try {
        const response = await fetch(
          "http://localhost:3000/auth/reset-password-email",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: this.username,
            }),
          }
        );

        const data = await response.json();

        if (!data.ok) {
          messagesStore.add({
            text: data.message || "Error processing request",
            color: "error",
            timeout: 3000,
          });
          throw new Error(data.message || "Error processing request");
        }

        messagesStore.add({
          color: "success",
          text: data.message || "Password reset link sent to your email",
        });

        this.switchToLogin();
      } catch (error) {
        console.error(error);
        messagesStore.add({
          text: "An unexpected error occurred.",
          color: "error",
          timeout: 3000,
        });
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<template>
  <div class="d-flex justify-space-between align-center bg-transparent">
    <h3 class="text-h3 text-center mb-0" v-if="this.forgotPassword">
      Reset Password
    </h3>
    <h3 class="text-h3 text-center mb-0" v-else>Login</h3>
    <router-link
      to="/register"
      class="text-primary text-decoration-none"
      v-if="!this.forgotPassword"
      >Don't Have an account?</router-link
    >
  </div>
  <v-form
    @submit.prevent="forgotPassword ? resetPassword : validate"
    class="mt-7 loginForm bg-transparent"
    @keydown.enter.prevent
  >
    <div class="mb-6">
      <v-label>Email Address</v-label>
      <v-text-field
        aria-label="email address"
        v-model="username"
        :rules="emailRules"
        class="mt-2"
        required
        hide-details="auto"
        variant="outlined"
        color="primary"
        autocomplete="email"
      ></v-text-field>
    </div>
    <div v-if="!this.forgotPassword">
      <v-label>Password</v-label>
      <v-text-field
        aria-label="password"
        v-model="password"
        :rules="passwordRules"
        required
        variant="outlined"
        color="primary"
        hide-details="auto"
        :type="show1 ? 'text' : 'password'"
        class="mt-2"
        autocomplete="current-password"
      >
        <template v-slot:append-inner>
          <v-btn
            color="secondary"
            icon
            rounded
            variant="text"
            @click="show1 = !show1"
          >
            <v-icon
              size="large"
              icon="mdi-eye-outline"
              v-if="show1 == false"
            ></v-icon>
            <v-icon
              size="large"
              icon="mdi-eye-off-outline"
              v-if="show1 == true"
            ></v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </div>

    <div class="d-flex align-center mt-4 mb-7 mb-sm-0">
      <v-checkbox
        v-model="checkbox"
        label="Keep me sign in"
        required
        class="ms-n2"
        hide-details
        v-if="!this.forgotPassword"
      ></v-checkbox>
      <div class="ml-auto">
        <p
          class="text-darkText link-hover cursor-pointer forgotText"
          @click="switchToForgotPassword"
          v-if="!this.forgotPassword"
        >
          Forgot Password?
        </p>
        <p
          class="text-darkText link-hover cursor-pointer forgotText"
          @click="switchToLogin"
          v-else
        >
          Back to Login
        </p>
      </div>
    </div>
    <v-btn
      color="primary"
      :loading="isSubmitting"
      block
      class="mt-4"
      variant="flat"
      size="large"
      @click="validate"
      v-if="!this.forgotPassword"
      >Login</v-btn
    >
    <v-btn
      color="primary"
      :loading="isSubmitting"
      block
      class="mt-4"
      variant="flat"
      size="large"
      @click="resetPassword"
      v-else
      >Submit</v-btn
    >
  </v-form>
</template>
<style>
.forgotText {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1976d2;
}
</style>
