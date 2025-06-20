<template>
  <v-container class="container">
    <v-row justify="space-between" align="center" class="mb-4">
      <h1 class="text-h5 pl-4">Security Settings</h1>
    </v-row>
    <v-card class="pa-4">
      <p class="text-subtitle-1 mb-4">Change your password</p>
      <v-form ref="form" @submit.prevent="formSubmit">
        <v-row>
          <v-col>
            <!-- This field is hidden to improve UX  -->
            <v-text-field variant="outlined" label="username" density="default" v-model="userEmail" type="text" autocomplete="username" name="username" style="display: none;">
            </v-text-field>

            <v-text-field variant="outlined" label="Current Password" density="default" v-model="CurrentPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="Current Password" :rules="passwordRules">
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field variant="outlined" label="New Password" density="default" v-model="NewPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="New Password" :rules="passwordRules">
            </v-text-field>
          </v-col>

          <v-col>
            <v-text-field variant="outlined" label="Confirm New Password" density="default" v-model="ConfirmPassword" placeholder="" type="password" hint="Password must be less than 10 characters" :persistent-hint="false" class="" autocomplete="new-password" name="Confirm Password" :rules="passwordRules">
            </v-text-field>
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            
            <v-btn color="primary" :loading="isSubmitting" block class="mt-4" variant="flat" size="large" @click="formSubmit">Save Changes</v-btn>
            
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import { useMessagesStore } from '@/stores/messages';
import { useAuthStore } from '@/stores/auth';
import  { fetchWithAuth } from '@/utils/fetchWithAuth.js';

  export default {
    data() {
      return {
        authStore: useAuthStore(),
        useMessagesStore: useMessagesStore(),
        form: null,
        isSubmitting: false,
        userEmail: "",
        CurrentPassword: "",
        NewPassword: "",
        ConfirmPassword: "",
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v === v.trim() || 'Password cannot start or end with spaces',
          (v) => v.length <= 10 || 'Password must be less than 10 characters'
        ],
      }
    },
    methods: {
      async formSubmit() {
        // Handle form submission logic here
        if (this.$refs.form.validate()) {
          if (this.CurrentPassword.length > 10 || this.CurrentPassword.length == 0) {
            console.error("Current password must be less than 10 characters and cannot be empty.");
            return;
          }

          if (this.NewPassword.length > 10 || this.NewPassword.length == 0) {
            console.error("New password must be less than 10 characters and cannot be empty.");
            return;
          }

          if (this.ConfirmPassword.length > 10 || this.ConfirmPassword.length == 0) {
            console.error("Confirm password must be less than 10 characters and cannot be empty.");
            return;
          }

          if (this.NewPassword !== this.ConfirmPassword) {
            useMessagesStore().add({
              color: 'error',
              text: 'New password and confirm password do not match.',
            });
            return;
          }
          this.isSubmitting = true;
          this.data = {
            currentPassword: this.CurrentPassword,
            newPassword: this.NewPassword,
          };
          try {
            const response = await fetchWithAuth(`http://localhost:3000/users/${this.authStore.getUserId}/changePassword`, {
              method: 'PATCH',
              body: JSON.stringify(this.data),
            });

            if (!response.ok) {
              const data = await response.json();
              throw new Error(data.message || 'Failed to change password');
            }

            this.isSubmitting = false;
            useMessagesStore().add({
              color: 'success',
              text: 'Password changed successfully.',
            });
          } catch (error) {
            let message = error.message || 'An unexpected error occurred.';

            if (error.details) {
              message = error.details.map(detail => `${detail.field}: ${detail.message}`).join(', ');
            }

            useMessagesStore().add({
              color: 'error',
              text: message,
            });

            this.isSubmitting = false;
          }
          
        } else {
          useMessagesStore().add({
            color: 'error',
            text: 'Error changing password.',
          });
        }

      },
    },
    mounted() {
      this.userEmail = this.authStore.getUserEmail;
      console.log('✅ SecuritySettingsView mounted!');
    }
  }
</script>

<style scoped>

</style>