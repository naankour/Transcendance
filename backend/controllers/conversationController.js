
const prisma = require('../prisma/prismaClient.js');

// récup ou crée la conv
const getOrCreateConversation = async (req, res) => {
  try {
    const { otherUserId } = req.body; 

    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId is required' });
    }

    const myId = Number(req.user.id);
    const otherId = Number(otherUserId);

    if (isNaN(otherId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (otherId === myId) {
      return res.status(400).json({ error: "You can't start a conversation with yourself (≖_≖ )" });
    }

    const userOneId = Math.min(myId, otherId);
    const userTwoId = Math.max(myId, otherId);

    let conversation = await prisma.conversations.findUnique({
      where: {
        user_one_id_user_two_id: {
          user_one_id: userOneId,
          user_two_id: userTwoId,
        },
      },
    });

    if (!conversation) {
      conversation = await prisma.conversations.create({
        data: {
          user_one_id: userOneId,
          user_two_id: userTwoId,
        },
      });
    }

    return res.json(conversation);
  } catch (error) {
    console.error('Error getting/creating conversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// liste les conv d'un user
const getMyConversations = async (req, res) => 
{
  try 
  {
    const myId = req.user.id;

    const conversations = await prisma.conversations.findMany({
      where: 
      {
        OR: [{ user_one_id: myId }, { user_two_id: myId }],
      },
      orderBy: { updated_at: 'desc' },
      include: 
      {
        user_one: 
        {
          select: { id: true, username: true, avatar_url: true },
        },
        user_two: 
        {
          select: { id: true, username: true, avatar_url: true },
        },
        messages: 
        {
          orderBy: { created_at: 'desc' },
          take: 1, 
        },
      },
    });

    const formatted = conversations.map((conv) => 
    {
      const otherUser = conv.user_one_id === myId ? conv.user_two : conv.user_one;
      return {
        id: conv.id,
        otherUser,
        lastMessage: conv.messages[0] || null,
        updated_at: conv.updated_at,
      };
    });

    return res.json(formatted);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    console.error('MESSAGE:', error.message);
    console.error('STACK:', error.stack);

    return res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
  }
};

// récup les messages d'une conv
const getMessages = async (req, res) => 
{
  try 
  { 
    const myId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await prisma.conversations.findUnique({
      where: { id: Number(conversationId) },
    });

    if (!conversation) 
      return res.status(404).json({ error: 'Conversation not found' });

    if (conversation.user_one_id !== myId && conversation.user_two_id !== myId) 
      return res.status(403).json({ error: "You don't have access to this conversation (ง •̀_•́)ง" });

    const messages = await prisma.messages.findMany({
      where: { conversation_id: Number(conversationId) },
      orderBy: { created_at: 'asc' },
      include: {
        sender: {
          select: { id: true, username: true, avatar_url: true },
        },
      },
    });

    return res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const myId = req.user.id;
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Message content is required' });
    }
    const conversation = await prisma.conversations.findUnique({
      where: { id: Number(conversationId) },
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.user_one_id !== myId && conversation.user_two_id !== myId) {
      return res.status(403).json({ error: "You don't have access to this conversation" });
    } 

    const message = await prisma.messages.create({
      data: {
        conversation_id: Number(conversationId),
        sender_id: myId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id:true, username: true, avatar_url: true },
        },
      },
    });

    await prisma.conversations.update({
      where: { id: Number(conversationId) },
      data: { updated_at: new Date() },
    });

    const io = req.app.get('io');
    const recipientId = conversation.user_one_id === myId ? conversation.user_two_id : conversation.user_one_id;

    io.to(`conversation_${conversationId}`).emit('newMessage', message);

    io.to(`user_${myId}`).to(`user_${recipientId}`).emit('conversationUpdated', {
      conversationId: Number(conversationId),
    });

    return res.status(201).json(message);
  }
  catch (error)
  {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getUnreadCount = async (req, res) => {
  try {
    const myId = req.user.id;

    const count = await prisma.messages.count({
      where: {
        sender_id: { not: myId },
        read_at: null,
        conversation: {
          OR: [{ user_one_id: myId }, { user_two_id: myId }],
        },
      },
    });

    return res.json({ count });
  }
  catch (error) {
    console.error('Error getting unread count:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const myId = req.user.id;
    const { conversationId } = req.params;

    const conversation = await prisma.conversations.findUnique({
      where: { id: Number(conversationId) },
    });
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (conversation.user_one_id !== myId && conversation.user_two_id !== myId)
    {
      return res.status(403).json({ error: "You don't have access to this conversation" });
    }

    await prisma.messages.updateMany({
      where: {
        conversation_id: Number(conversationId),
        sender_id: { not: myId },
        read_at: null,
      },
      data: { read_at: new Date() },
    });

    return res.json({ success: true });
  }
  catch (error)
  {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getOrCreateConversation,
  getMyConversations,
  getMessages,
  sendMessage,
  getUnreadCount,
  markAsRead,
};