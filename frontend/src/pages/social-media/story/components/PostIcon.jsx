const PostIcon = ({
  iconFn,
  iconSize = "text-2xl",
  iconSizeMd = "md:text-3xl",
}) => {
  const IconComponent = iconFn();

  return (
    <IconComponent className={`${iconSize} ${iconSizeMd} cursor-pointer`} />
  );
};

export { PostIcon };
