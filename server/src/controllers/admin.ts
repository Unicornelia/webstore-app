import Product from '../models/product';
import { Request, Response } from 'express';

const getAddProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    res
      .status(200)
      .json({ isAuthenticated: req.session.isAuthenticated, editing: false });
  } catch (e) {
    console.error(`Error in getAddProduct: ${e}`);
  }
};

const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ userId: req.user._id });
    res
      .status(200)
      .json({ products, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in fetching all products: ${e}`);
  }
};

const postAddProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new Product({
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      price: req.body.price,
      description: req.body.description,
      userId: req.user._id,
    });
    const result = await product.save();
    res
      .status(201)
      .json({ result, isAuthenticated: req.session.isAuthenticated });
    console.info(`Added new product: ${result}`);
  } catch (e: unknown) {
    console.error(
      `Error in postAddProduct: ${e instanceof Error ? e.message : e}`
    );
  }
};

const getEditProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const editMode = req.query.editing;
    if (!editMode) {
      return res.redirect('/');
    }
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.redirect('/');
    }
    res
      .status(200)
      .json({ product, isAuthenticated: req.session.isAuthenticated });
  } catch (e) {
    console.error(`Error in getEditProduct: ${e}`);
  }
};

const postEditProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, title, imageUrl, price, description } = req.body;

    const product = await Product.findById(id);
    if (product) {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      } else {
        product.title = title;
        product.imageUrl = imageUrl;
        product.price = price;
        product.description = description;

        const result = await product.save();
        res
          .status(201)
          .json({ result, isAuthenticated: req.session.isAuthenticated });
        console.info(`Updated product: ${result}`);
      }
    }
  } catch (e) {
    console.error(`Error in updating product: ${e}`);
  }
};

const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    await Product.deleteOne({ _id: req.body.productId, userId: req.user._id });
    console.log(`Product ${id} has been deleted`);
    res.status(201).json({ message: 'Product deleted successfully' });
  } catch (e) {
    console.error(`Error deleting product: ${e}`);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

export {
  getAddProduct,
  getProducts,
  postAddProduct,
  getEditProduct,
  postEditProduct,
  deleteProduct,
};
