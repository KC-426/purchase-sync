
import express from 'express'
import { addUserOnAdmin, deleteUserOnAdmin, getUsersOnAdmin } from '../controllers/adminManageRolesController.js'


const router = express.Router()

router.route('/add-user-roles-on-admin').post(addUserOnAdmin)
router.route('/get-roles-on-admin').get(getUsersOnAdmin)
router.route('/delete-roles-on-admin/:id').delete(deleteUserOnAdmin)



export default router