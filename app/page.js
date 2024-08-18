'use client'
import Image from "next/image";
import Head from "next/head";
import IconButton from '@mui/material/IconButton';
import Add from '@mui/icons-material/Add';
import Remove from '@mui/icons-material/Remove';
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { getDocs, collection, query, setDoc, deleteDoc, getDoc, doc } from 'firebase/firestore'
import { Box, Modal, Typography, Button, Stack, TextField } from "@mui/material";

export default function Home() {
  //States
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  //Function of Updating Inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach(doc => {
      inventoryList.push({
        name: doc.id, ...doc.data()
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }
  //Function of Removing from Inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  //Function of Adding to Inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }

  //The side effect of updating inventory, empty dependency because running once. Dont have side effect yet, might need to fetch collection.
  useEffect(() => {
    updateInventory()
  }, [])
  //Modal Functions?
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: `url('/images/luke.jpg')`, // Use the path relative to the public directory
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <Button variant="container"
        sx={{
          backgroundColor: 'rgba(242, 109, 153)', // Black background with 70% opacity
          color: '#fff', // White text color
          padding: '5px 10px', // Padding around the text
          borderRadius: '15px', // Rounded corners
          fontFamily: "'Courier New', sans-serif",
          textTransform: 'none', // Ensures text is not transformed (keeps it as typed)
          fontSize: '1rem',

          '&:hover': {
            backgroundColor: 'rgba(242, 109, 153)',
            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',// Slightly more opaque on hover
          },
        }}
        onClick={() => {
          handleOpen()
        }}>Add New Item</Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}

          border="2px solid transparent"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
            backgroundColor: "rgb(242, 109, 153, 0.9)",
            color: '#fff',
            padding: '10px 20px', // Padding around the text
            borderRadius: '15px', // Rounded corners
            fontFamily: "'Courier New', sans-serif",

          }}
        >
          <Typography variant="h6" sx={{
            fontFamily: "'Courier New', sans-serif",
          }}> Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined" sx={{
                marginTop: 2, // Margin to push the button down
                backgroundColor: 'rgba(254, 153, 3, 0.7)', // Orange color with transparency
                color: '#fff',
                '&:hover': {
                  backgroundColor: 'rgba(254, 153, 3, 0.8)',
                  border: 'none'
                },
                borderRadius: '15px', // Rounded corners
                border: 'none', // Remove any border
              }}
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Typography variant="h1"
        sx={{
          position: 'fixed', // Fixes the position of the header
          top: '100px', // Adjusts how high it is on the page
          fontFamily: "'Courier New', sans-serif",
          fontWeight: 'bold',
          fontSize: '3rem',
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '15px',
          display: 'inline-block',
          textShadow: '0px 0px 10px rgba(242, 109, 153)', // Pink glow effect behind text
          backgroundColor: 'transparent', // No background color
        }}>Inventory Manager</Typography>

      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {
          inventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display="flex"
              sx={{
                border: '2px solid rgba(254, 153, 3, 0.5)', // Soft border with transparency
                color: '#fff',
                backgroundColor: 'rgba(254, 153, 3, 0.4)',
                padding: '10px 20px', // Padding around the text
                borderRadius: '15px', // Rounded corners
                fontFamily: "'Courier New', sans-serif",
              }}

              alignItems="center"
              justifyContent="space-between"
              bgColor="#f0f0f0"
            >


              <Typography variant="h5" color="#fff"
                sx={{
                  fontFamily: "'Courier New', sans-serif",
                  fontWeight: 'bold'

                }} textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography sx={{
                backgroundColor: 'rgba(242, 109, 153, 0.8)', // Background color
                color: '#fff', // Text color
                borderRadius: '50%', // Circular shape
                width: '40px', // Fixed width
                height: '40px', // Fixed height
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem', // Font size
                fontWeight: 'bold',
                fontFamily: "'Courier New', sans-serif", // Font family
              }}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <IconButton variant="contained" sx={{
                  backgroundColor: 'rgba(242, 109, 153, 0.8)',
                  color: '#fff',
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: 'rgba(242, 109, 153, 0.9)',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Shadow on hover
                  },
                }} onClick={() => {
                  addItem(name)
                }}>
                  <Add />
                </IconButton>
                <IconButton variant="contained" sx={{
                  backgroundColor: 'rgba(242, 109, 153, 0.8)',
                  color: '#fff',
                  borderRadius: '50%',
                  '&:hover': {
                    backgroundColor: 'rgba(242, 109, 153, 0.9)',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Shadow on hover
                  },
                }} onClick={() => {
                  removeItem(name)
                }}>
                  <Remove />
                </IconButton>
              </Stack>
            </Box>
          ))
        }
      </Stack>
    </Box>

  )
}

